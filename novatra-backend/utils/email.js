const nodemailer = require('nodemailer');

// Nodemailer setup with Gmail
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Reusable send email function
const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: `"Novatra Store" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html // we’ll send HTML instead of plain text
    };

    await transporter.sendMail(mailOptions);
    console.log('📩 Email sent successfully via Gmail');
  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
    throw new Error('Email could not be sent');
  }
};

// OTP generator
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Email template for OTP
const otpTemplate = (name, otp) => {
  return `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2 style="color:#4CAF50;">Welcome to Novatra Store 🎉</h2>
      <p>Hi <b>${name}</b>,</p>
      <p>Thank you for joining <b>Novatra Store</b>! We’re excited to have you onboard.</p>
      <p>Your One-Time Password (OTP) for verification is:</p>
      <h1 style="color:#4CAF50; letter-spacing: 3px;">${otp}</h1>
      <p>This OTP is valid for <b>10 minutes</b>. Please do not share it with anyone.</p>
      <br/>
      <p>Best Regards,<br/>The <b>Novatra Store</b> Team</p>
      <hr/>
      <small>If you did not sign up, please ignore this email.</small>
    </div>
  `;
};

module.exports = { sendEmail, generateOTP, otpTemplate };
