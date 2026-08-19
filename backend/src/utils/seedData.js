const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('../config/db');
const Admin = require('../models/Admin');
const User = require('../models/User');
const Advertisement = require('../models/Advertisement');
const Banner = require('../models/Banner');
const Subscription = require('../models/Subscription');
const Lead = require('../models/Lead');
const Report = require('../models/Report');
const VisitorWin = require('../models/VisitorWin');
const SystemSettings = require('../models/SystemSettings');

const seedData = async () => {
  try {
    await connectDB();

    console.log('Clearing existing collections...');
    await Admin.deleteMany({});
    await User.deleteMany({});
    await Advertisement.deleteMany({});
    await Banner.deleteMany({});
    await Subscription.deleteMany({});
    await Lead.deleteMany({});
    await Report.deleteMany({});
    await VisitorWin.deleteMany({});
    await SystemSettings.deleteMany({});

    console.log('Seeding Super Admin...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await Admin.create({
      adminId: 'ADM-901',
      name: 'Rahul Sharma',
      email: 'admin@homescooter.com',
      password: hashedPassword,
      role: 'SUPER_ADMIN',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    });

    console.log('Seeding Users...');
    await User.insertMany([
      {
        userId: 'USR-8821',
        name: 'Hoskote Realties',
        phone: '+91 98765 43210',
        email: 'contact@hoskoterealty.com',
        avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200',
        isVerified: true,
        isSubscribed: true,
        subscriptionExpiry: new Date(Date.now() + 10 * 86400000),
        status: 'Active',
        postedAdsCount: 14,
        approvedAdsCount: 12,
        rejectedAdsCount: 2,
      },
      {
        userId: 'USR-8822',
        name: 'Ananya Rao',
        phone: '+91 91234 56789',
        email: 'ananya.rao@gmail.com',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
        isVerified: true,
        isSubscribed: false,
        status: 'Active',
        postedAdsCount: 3,
        approvedAdsCount: 2,
        rejectedAdsCount: 1,
      },
      {
        userId: 'USR-8823',
        name: 'Vikram Mehta',
        phone: '+91 98888 77766',
        email: 'vikram.mehta@tech.com',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
        isVerified: true,
        isSubscribed: true,
        subscriptionExpiry: new Date(Date.now() + 10 * 86400000),
        status: 'Active',
        postedAdsCount: 8,
        approvedAdsCount: 8,
      },
      {
        userId: 'USR-8824',
        name: 'Suspicious Spammer',
        phone: '+91 90000 11111',
        email: 'spam.user@fake.com',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
        isVerified: false,
        isSubscribed: false,
        status: 'Banned',
        bannedReason: 'Multiple fraudulent plot listings & prohibited content.',
        bannedAt: new Date(),
        reportsCount: 8,
      },
    ]);

    console.log('Seeding Advertisements...');
    await Advertisement.insertMany([
      {
        adId: 'AD1024',
        title: '30x40 Hoskote Corner Plot - Gated Community',
        description: 'A premium East-facing plot in a fast-developing gated community near Hoskote NH-75. Clear titles, BDA approved layout.',
        price: 1000000,
        priceUnit: '₹',
        location: 'Hoskote, Bangalore',
        city: 'Bangalore',
        distanceKm: 14.5,
        category: 'Layout Sites',
        imageUrls: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800'],
        posterName: 'Hoskote Realties',
        posterPhone: '+91 98765 43210',
        posterEmail: 'contact@hoskoterealty.com',
        posterId: 'USR-8821',
        viewsCount: 25400,
        status: 'PENDING',
        isHighDemand: true,
        isFeatured: true,
        dimensions: '30ft x 40ft (1200 Sq.Ft)',
        facing: 'East Facing',
        amenities: ['BDA Approved', 'Gated Security', '40ft Road'],
        promoTag: 'Featured Plot',
      },
      {
        adId: 'AD1025',
        title: 'Modern 3 BHK Luxury Apartment in Whitefield',
        description: 'Fully furnished 3 BHK apartment with modular kitchen, private balcony, marble flooring in prime Whitefield IT corridor.',
        price: 8500000,
        priceUnit: '₹',
        location: 'Whitefield, Bangalore',
        city: 'Bangalore',
        distanceKm: 8.2,
        category: 'Properties',
        propertySubType: 'Sale: House & Apartments',
        imageUrls: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800'],
        posterName: 'Ananya Rao',
        posterPhone: '+91 91234 56789',
        posterEmail: 'ananya.rao@gmail.com',
        posterId: 'USR-8822',
        viewsCount: 18200,
        status: 'PENDING',
        isFeatured: true,
        dimensions: '1680 Sq.Ft',
        facing: 'North-East',
        bhk: '3 BHK',
        furnishing: 'Fully Furnished',
        amenities: ['Swimming Pool', 'Gym', '24/7 Power Backup'],
        promoTag: 'High ROI',
      },
      {
        adId: 'AD1026',
        title: 'Ather 450X Gen 3 Electric Scooter (Mint Condition)',
        description: 'Only 3,400 KM driven. Space Grey color, fast charger included, official warranty valid till 2027.',
        price: 115000,
        priceUnit: '₹',
        location: 'Electronic City, Bangalore',
        city: 'Bangalore',
        distanceKm: 18.0,
        category: 'Electric Scooters',
        imageUrls: ['https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=800'],
        posterName: 'Vikram Mehta',
        posterPhone: '+91 98888 77766',
        posterEmail: 'vikram.mehta@tech.com',
        posterId: 'USR-8823',
        viewsCount: 9400,
        status: 'APPROVED',
        isHighDemand: true,
        batteryRangeKm: '105 km/charge',
        maxSpeed: '90 km/h',
        brandModel: 'Ather 450X Gen 3',
        promoTag: 'Verified E-Scooter',
      },
      {
        adId: 'AD1027',
        title: 'Commercial Office Space 2500 Sq.Ft - Indiranagar',
        description: 'Prime ground floor office space with 30 workstations, 2 glass cabin rooms, conference hall, cafeteria area.',
        price: 180000,
        priceUnit: '₹/mo',
        location: 'Indiranagar 100ft Road, Bangalore',
        city: 'Bangalore',
        distanceKm: 5.1,
        category: 'Properties',
        propertySubType: 'Rent: Shop & Offices',
        imageUrls: ['https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800'],
        posterName: 'Apex Commercial Properties',
        posterPhone: '+91 98450 11223',
        posterEmail: 'leases@apexcommercial.in',
        posterId: 'USR-8824',
        viewsCount: 31200,
        status: 'APPROVED',
        isHighDemand: true,
        isFeatured: true,
        dimensions: '2500 Sq.Ft',
        facing: 'South Facing',
        furnishing: 'Fully Furnished Workstations',
        amenities: ['100% DG Backup', 'High Speed Fiber'],
        promoTag: 'Prime Location',
      },
    ]);

    console.log('Seeding Banners...');
    await Banner.insertMany([
      {
        bannerId: 'BAN-100',
        title: 'Hoskote Luxury Plots Launch Event Promo Banner',
        targetScreen: 'Home Top Carousel',
        imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1200',
        destinationUrl: 'https://homescooter.com/hoskote-launch',
        phoneNumber: '+91 98765 43210',
        sponsorName: 'Hoskote Realties',
        startDate: '2026-08-20',
        expiryDate: '2026-09-05',
        status: 'Pending',
        impressions: 0,
        clicks: 0,
      },
      {
        bannerId: 'BAN-101',
        title: 'Independence Day Real Estate Mega Expo 2026',
        targetScreen: 'Home Top Carousel',
        imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200',
        destinationUrl: 'https://homescooter.com/expo2026',
        phoneNumber: '+91 98000 11122',
        sponsorName: 'Bangalore Builders Forum',
        startDate: '2026-08-10',
        expiryDate: '2026-08-25',
        status: 'Active',
        impressions: 48900,
        clicks: 3420,
      },
    ]);

    console.log('Seeding Subscriptions...');
    await Subscription.insertMany([
      {
        subId: 'SUB-9821',
        userId: 'USR-8821',
        userName: 'Hoskote Realties',
        userPhone: '+91 98765 43210',
        userEmail: 'contact@hoskoterealty.com',
        amount: 100,
        currency: '₹',
        upiReference: 'UPI/423981048123/PAY',
        screenshotUrl: 'https://images.unsplash.com/photo-1556742049-0a67e06a382e?auto=format&fit=crop&q=80&w=800',
        status: 'Pending',
        notes: '₹100 GPay payment done for 10 days free posting membership.',
      },
      {
        subId: 'SUB-9823',
        userId: 'USR-8823',
        userName: 'Vikram Mehta',
        userPhone: '+91 98888 77766',
        userEmail: 'vikram.mehta@tech.com',
        amount: 100,
        currency: '₹',
        upiReference: 'UPI/423980011223/PAY',
        screenshotUrl: 'https://images.unsplash.com/photo-1556742049-0a67e06a382e?auto=format&fit=crop&q=80&w=800',
        status: 'Activated',
        activatedDate: new Date(),
        expiryDate: new Date(Date.now() + 10 * 86400000),
        generatedUsername: 'MEMBER_8901',
        generatedPassword: 'Pass#8901',
        whatsAppSent: true,
      },
    ]);

    console.log('Seeding Leads...');
    await Lead.insertMany([
      {
        leadId: 'LEAD-501',
        adId: 'AD1024',
        adTitle: '30x40 Hoskote Corner Plot - Gated Community',
        posterName: 'Hoskote Realties',
        posterPhone: '+91 98765 43210',
        buyerName: 'Ramesh Patel',
        buyerPhone: '+91 99112 23344',
        location: 'Bangalore',
        status: 'New',
      },
    ]);

    console.log('Seeding Reports...');
    await Report.insertMany([
      {
        reportId: 'REP-301',
        adId: 'AD1030',
        adTitle: 'Villa Plot in Devanahalli Airport Corridor',
        sellerName: 'Suresh Kumar',
        sellerPhone: '+91 94444 33221',
        reporterName: 'Manoj Kumar',
        reporterPhone: '+91 93333 22211',
        reportReason: 'Inaccurate Information',
        comment: 'The location given in the ad is 10KM away from actual site.',
        status: 'Pending',
      },
    ]);

    console.log('Seeding Visitor Win...');
    await VisitorWin.insertMany([
      {
        registrationId: 'VW-901',
        name: 'Harish N',
        place: 'Whitefield, Bangalore',
        age: 29,
        phone: '+91 98711 22334',
        subject: 'Looking for 30x40 plot in Hoskote',
      },
    ]);

    console.log('Seeding System Settings...');
    await SystemSettings.create({
      autoApproveVerified: false,
      mandatoryImages: true,
      subscriptionPrice: 100,
      subscriptionDays: 10,
      whatsAppDispatchEnabled: true,
      emailNotificationsEnabled: true,
    });

    console.log('Database Seeding Completed Successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Database Seeding Failed:', error);
    process.exit(1);
  }
};

seedData();
