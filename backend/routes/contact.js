const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// Create a transporter object
const transporter = nodemailer.createTransport({
  service: 'gmail', // You can use other services like SendGrid, Mailgun, etc.
  auth: {
    user: process.env.EMAIL_USER || '3@threehire.com',  // Your email
    pass: process.env.EMAIL_PASS || ''  // Your email password or app password
  }
});

// Email configuration
const mailConfig = {
  from: process.env.EMAIL_USER || '3@threehire.com',
  to: '3@threehire.com',  // Where you want to receive the emails
  subject: 'New Contact Form Submission'
};

// POST /api/contact - Handle contact form submissions
router.post('/', async (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  
  // Validate input
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ success: false, message: 'Please provide all required fields' });
  }
  
  try {
    // Customize email content
    const mailOptions = {
      ...mailConfig,
      subject: `New Contact Form: ${subject}`,
      html: `
        <h2>New contact form submission from ${name}</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <h3>Message:</h3>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `
    };
    
    // Send email
    await transporter.sendMail(mailOptions);
    
    // Send auto-reply to the sender
    const autoReplyOptions = {
      from: process.env.EMAIL_USER || '3@threehire.com',
      to: email,
      subject: 'Thank you for contacting 3Hire',
      html: `
        <h2>Thank you for contacting 3Hire!</h2>
        <p>Dear ${name},</p>
        <p>We have received your message regarding "${subject}". We appreciate you taking the time to reach out to us.</p>
        <p>Our team will review your inquiry and get back to you as soon as possible, typically within 24-48 business hours.</p>
        <p>For urgent matters, please call us at 480-331-4161.</p>
        <p>Best regards,</p>
        <p>The 3Hire Team</p>
      `
    };
    
    await transporter.sendMail(autoReplyOptions);
    
    res.status(200).json({ success: true, message: 'Your message has been sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, message: 'Failed to send email. Please try again later.' });
  }
});

module.exports = router;