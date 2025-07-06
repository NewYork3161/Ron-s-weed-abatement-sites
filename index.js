const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();

// ✅ MongoDB Atlas connection
const DB_URI = 'mongodb+srv://root:RnaRDcMgNq8B2iWL@cluster0.mmhyyv3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB Atlas'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// ✅ Middleware
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// ✅ View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ✅ Page Routes
app.get('/', (req, res) => {
  res.render('home', { title: 'Home | Bower Company Weed Abatement' });
});

app.get('/about', (req, res) => {
  res.render('about', { title: 'About Us | Bower Company Weed Abatement' });
});

app.get('/contact', (req, res) => {
  res.render('contact', { title: 'Contact Us | Bower Company Weed Abatement' });
});

app.get('/confirmation', (req, res) => {
  res.render('email_confirmation', { title: 'Email Sent | Bower Company' });
});

// ✅ Handle Contact Form Submission
app.post('/send-email', async (req, res) => {
  const { name, email, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'hudsonriver4151@gmail.com',
      pass: 'nrauproepfuyltvu' // Use actual Gmail App Password (not .env)
    }
  });

  const mailToUser = {
    from: `"Bower Company" <hudsonriver4151@gmail.com>`,
    to: email,
    subject: "Thank you for contacting Bower Company",
    html: `
      <h2>Hi ${name},</h2>
      <p>We’ve received your message and will get back to you shortly.</p>
      <p><strong>Phone:</strong> (916) 206-4059</p>
      <p><a href="https://www.google.com/maps?q=2486+Warren+Lane,+Walnut+Creek,+CA">📍 Directions</a></p>
      <p>We operate 7 days a week from 6am to 6pm.</p>
      <br>
      <p>Thanks again,<br><strong>Bower Company Weed Abatement</strong></p>
    `
  };

  const mailToOwner = {
    from: email,
    to: 'hudsonriver4151@gmail.com',
    subject: `🌾 New Contact Submission from ${name}`,
    html: `
      <h3>New Inquiry from Website</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong><br>${message}</p>
    `
  };

  try {
    await transporter.sendMail(mailToUser);
    await transporter.sendMail(mailToOwner);
    res.redirect('/confirmation');
  } catch (err) {
    console.error('❌ Email sending failed:', err);
    res.status(500).send('Email failed. Try again later.');
  }
});

// ✅ Server Startup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
