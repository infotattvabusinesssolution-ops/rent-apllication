const nodemailer = require('nodemailer');

/**
 * Creates and configures the Nodemailer SMTP Transporter
 */
const getTransporter = () => {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;
  const user = process.env.SMTP_USER || '';
  const pass = process.env.SMTP_PASS || '';

  // Return null if credentials are placeholders or empty
  if (!user || user === 'your_email@gmail.com' || !pass || pass === 'your_email_app_password') {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
};

/**
 * Sends a modern, branded password reset email via SMTP
 * 
 * @param {Object} options
 * @param {string} options.toEmail - Recipient email address
 * @param {string} options.userName - Recipient name
 * @param {string} options.resetOtp - 6-digit OTP code
 * @param {string} options.resetUrl - Full web URL to reset password
 * @returns {Promise<{ sent: boolean, message: string }>}
 */
const sendPasswordResetEmail = async ({ toEmail, userName, resetOtp, resetUrl }) => {
  const fromName = process.env.SMTP_FROM_NAME || 'Home & Scooter Support';
  const fromEmail = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER || 'noreply@homeandscooterapp.online';

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password - Home & Scooter</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f1f5f9;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #1e293b;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      max-width: 580px;
      margin: 30px auto;
      background: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
      border: 1px solid #e2e8f0;
    }
    .header {
      background: linear-gradient(135deg, #0F766E 0%, #2563EB 100%);
      padding: 36px 30px;
      text-align: center;
      color: #ffffff;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 800;
      letter-spacing: -0.5px;
    }
    .header p {
      margin: 8px 0 0;
      font-size: 14px;
      opacity: 0.9;
    }
    .content {
      padding: 36px 30px;
    }
    .greeting {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 12px;
      color: #0f172a;
    }
    .description {
      font-size: 14px;
      line-height: 1.6;
      color: #475569;
      margin-bottom: 24px;
    }
    .otp-box {
      background-color: #f8fafc;
      border: 2px dashed #cbd5e1;
      border-radius: 12px;
      padding: 20px;
      text-align: center;
      margin: 24px 0;
    }
    .otp-label {
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #64748b;
      margin-bottom: 8px;
    }
    .otp-code {
      font-size: 34px;
      font-weight: 800;
      letter-spacing: 8px;
      color: #0f766e;
      font-family: 'Courier New', monospace;
    }
    .otp-expiry {
      font-size: 12px;
      color: #94a3b8;
      margin-top: 6px;
    }
    .divider {
      text-align: center;
      position: relative;
      margin: 28px 0;
    }
    .divider::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      height: 1px;
      background: #e2e8f0;
    }
    .divider span {
      position: relative;
      background: #ffffff;
      padding: 0 16px;
      font-size: 12px;
      font-weight: 700;
      color: #94a3b8;
      text-transform: uppercase;
    }
    .button-container {
      text-align: center;
      margin: 24px 0;
    }
    .button {
      display: inline-block;
      background: linear-gradient(135deg, #0f766e 0%, #0d9488 100%);
      color: #ffffff !important;
      text-decoration: none;
      padding: 14px 32px;
      border-radius: 10px;
      font-size: 15px;
      font-weight: 700;
      letter-spacing: 0.3px;
      box-shadow: 0 4px 12px rgba(15, 118, 110, 0.25);
    }
    .fallback-url {
      font-size: 12px;
      color: #64748b;
      word-break: break-all;
      background: #f8fafc;
      padding: 12px;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
      margin-top: 10px;
    }
    .footer {
      background-color: #f8fafc;
      padding: 24px 30px;
      border-top: 1px solid #e2e8f0;
      text-align: center;
      font-size: 12px;
      color: #94a3b8;
      line-height: 1.5;
    }
    .security-note {
      font-size: 12px;
      color: #ef4444;
      margin-top: 16px;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>Home & Scooter</h1>
      <p>Password Reset Request</p>
    </div>
    <div class="content">
      <div class="greeting">Hello ${userName || 'User'},</div>
      <div class="description">
        We received a request to reset your password for your <strong>Home & Scooter Marketplace</strong> account.
        Use either the 6-digit verification code below in the mobile app, or click the direct reset link.
      </div>

      <div class="otp-box">
        <div class="otp-label">Your Verification Code</div>
        <div class="otp-code">${resetOtp}</div>
        <div class="otp-expiry">Valid for 15 minutes</div>
      </div>

      <div class="divider">
        <span>OR CLICK BELOW</span>
      </div>

      <div class="button-container">
        <a href="${resetUrl}" class="button" target="_blank">Reset Password Now</a>
      </div>

      <p class="description" style="font-size: 12px; margin-top: 16px;">
        If the button above does not open, copy and paste this link in your web browser:
      </p>
      <div class="fallback-url">${resetUrl}</div>

      <div class="security-note">
        ⚠️ If you did not request this password reset, please ignore this email or contact support immediately. Your password will remain unchanged.
      </div>
    </div>
    <div class="footer">
      &copy; ${new Date().getFullYear()} Home & Scooter Marketplace. All rights reserved.<br>
      This is an automated message, please do not reply to this email.
    </div>
  </div>
</body>
</html>
`;

  const transporter = getTransporter();

  if (!transporter) {
    console.log('\n======================================================');
    console.log('📧 [SMTP MOCK / DEVELOPMENT LOG]');
    console.log(`To: ${toEmail}`);
    console.log(`Subject: Reset Your Password - Home & Scooter`);
    console.log(`🔐 OTP Code: ${resetOtp}`);
    console.log(`🔗 Reset Link: ${resetUrl}`);
    console.log('ℹ️ Tip: Configure SMTP_USER and SMTP_PASS in backend/.env for real email dispatch.');
    console.log('======================================================\n');
    return {
      sent: true,
      simulated: true,
      message: 'SMTP credentials not configured. OTP logged to backend console.',
    };
  }

  try {
    const info = await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: toEmail,
      subject: `Your Password Reset Code: ${resetOtp} - Home & Scooter`,
      text: `Hello ${userName || 'User'},\n\nYour password reset verification code is: ${resetOtp}\n\nOr reset via link: ${resetUrl}\n\nThis code expires in 15 minutes.\nIf you did not request this, please ignore this email.`,
      html: htmlContent,
    });

    console.log(`📧 [SMTP SUCCESS] Reset email sent to ${toEmail}: ${info.messageId}`);
    return {
      sent: true,
      simulated: false,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error('❌ [SMTP ERROR] Failed to send email:', error.message);
    // Even if SMTP server fails, log the OTP in dev so testing is unblocked
    console.log(`[SMTP DEV FALLBACK] OTP for ${toEmail}: ${resetOtp}`);
    console.log(`[SMTP DEV FALLBACK] Reset Link: ${resetUrl}`);
    return {
      sent: false,
      error: error.message,
    };
  }
};

module.exports = {
  sendPasswordResetEmail,
};
