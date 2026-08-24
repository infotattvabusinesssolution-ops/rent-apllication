const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const PremiumMember = require('../models/PremiumMember');

const protectPremium = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_jwt_key_homescooter_2026');

      const memberQuery = [{ premiumMemberId: decoded.id }, { userId: decoded.id }];
      if (mongoose.Types.ObjectId.isValid(decoded.id)) {
        memberQuery.push({ _id: decoded.id });
      }
      const member = await PremiumMember.findOne({ $or: memberQuery });

      if (!member) {
        return res.status(401).json({ success: false, message: 'Premium Member account not found' });
      }

      if (member.status === 'BLOCKED') {
        return res.status(403).json({
          success: false,
          code: 'MEMBER_BLOCKED',
          message: 'Your Premium account has been blocked by administration.',
        });
      }

      if (member.status === 'CANCELLED') {
        return res.status(403).json({
          success: false,
          code: 'MEMBER_CANCELLED',
          message: 'Your Premium Membership has been cancelled.',
        });
      }

      // Check Expiry Date against current time
      const now = new Date();
      if (member.expiryDate && new Date(member.expiryDate) < now) {
        if (member.status !== 'EXPIRED') {
          member.status = 'EXPIRED';
          await member.save();
        }
        return res.status(403).json({
          success: false,
          code: 'MEMBERSHIP_EXPIRED',
          message: 'Your Premium Membership has expired. Please renew your plan to continue accessing Premium content.',
          expiryDate: member.expiryDate,
        });
      }

      if (member.status !== 'ACTIVE') {
        return res.status(403).json({
          success: false,
          code: 'MEMBER_INACTIVE',
          message: 'Your Premium Membership is currently pending activation or inactive.',
        });
      }

      req.premiumMember = member;
      return next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Invalid or expired Premium session token' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Premium authentication token required' });
  }
};

module.exports = { protectPremium };
