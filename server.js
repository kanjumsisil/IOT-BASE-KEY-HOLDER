/*const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({ secret: 'smartKeySecret', resave: false, saveUninitialized: true }));

// MongoDB connection
mongoose.connect("mongodb+srv://user1:malafiki@leodb.5mf7q.mongodb.net/?retryWrites=true&w=majority&appName=leodb");
mongoose.connection.on("connected", () => {
  console.log("✅ MongoDB connected successfully (local)");
});
mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB connection error:", err);
});

// MongoDB Schemas
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  photo: String
});

const locationSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  latitude: String,
  longitude: String,
  placeName: String,
  timestamp: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Location = mongoose.model('Location', locationSchema);

// Multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Email config (no .env used)
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "leotitogalaxy@gmail.com",
      pass: "anxd ruea situ btug", // Replace with your email password
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
  });

// Routes
app.get('/', (req, res) => res.sendFile(__dirname + '/public/register.html'));

app.post('/register', upload.single('photo'), async (req, res) => {
  const { firstName, lastName, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.send('Passwords do not match');
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) return res.send('User already exists');

  const user = new User({
    firstName,
    lastName,
    email,
    password,
    photo: req.file.filename
  });

  await user.save();

  // Send welcome email
  const mailOptions = {
    from: 'leotitogalaxy@gmail.com',
    to: email,
    subject: 'Welcome to Smart Key Holder Finder!',
    text: `Dear ${firstName},\n\nThank you for registering on our platform.\n\nBest regards,\nSmart Key Team`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) console.log('Email error:', error);
    else console.log('Email sent:', info.response);
  });

  res.redirect('/login.html');
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });

  if (!user) return res.send('Invalid credentials');
  req.session.userId = user._id;
  res.redirect('/dashboard.html');
});

app.get('/user', async (req, res) => {
  const user = await User.findById(req.session.userId);
  if (!user) return res.status(401).send('Not logged in');
  res.json(user);
});

app.post('/location', async (req, res) => {
  const { latitude, longitude, placeName } = req.body;
  const userId = req.session.userId;

  if (!userId) return res.status(401).send('Not logged in');

  const loc = new Location({ userId, latitude, longitude, placeName });
  await loc.save();
  res.sendStatus(200);
});

app.post('/delete', async (req, res) => {
  const userId = req.session.userId;
  const user = await User.findById(userId);
  if (user && user.photo) {
    fs.unlinkSync(path.join(__dirname, 'uploads', user.photo));
  }
  await User.deleteOne({ _id: userId });
  await Location.deleteMany({ userId });
  req.session.destroy(() => res.redirect('/'));
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/login.html'));
});
app.get('/locationKeys', async (req, res) => {
    const userId = req.session.userId;
    if (!userId) {
      return res.redirect('/login.html');
    }
  
    const locations = await Location.find({ userId }).sort({ timestamp: -1 }); // Get locations of the user
    const user = await User.findById(userId);
    res.render('locationKeys', { locations, user }); // Send locations and user data to the locationKeys page
  });
  

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
*/
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const session = require('express-session');
const bcrypt = require('bcrypt');
const path = require('path');
const bodyParser = require('body-parser');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(session({
  secret: 'smartkey_secret',
  resave: false,
  saveUninitialized: true
}));

// ✅ Cloudinary config
cloudinary.config({
  cloud_name: "drxvftof4",
  api_key: "872961783425164",
  api_secret: "KWEJ6SbPybty7YefACspZ-j-ym0",
});
console.log("✅ Cloudinary Connected");

// ✅ Multer Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'smartkey_users',
    allowed_formats: ['jpg', 'jpeg', 'png']
  }
});
const upload = multer({ storage });

// ✅ MongoDB Atlas connection
mongoose.connect("mongodb+srv://user1:malafiki@leodb.5mf7q.mongodb.net/mediaz?retryWrites=true&w=majority&appName=leodb")
  .then(() => console.log("✅ MongoDB connected to mediaz"))
  .catch((err) => console.error("❌ Connection error:", err));


// ✅ Schema
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  photo: String
});
const locationSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  latitude: String,
  longitude: String,
  placeName: String,
  date: { type: Date, default: Date.now }
});
const User = mongoose.model('User', userSchema);
const Location = mongoose.model('Location', locationSchema);

// ✅ Routes

app.get('/', (req, res) => res.redirect('/login.html'));

app.post('/register', upload.single('photo'), async (req, res) => {
  const { firstName, lastName, email, password, confirmPassword } = req.body;
  if (password !== confirmPassword) return res.send("Passwords do not match");

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    photo: req.file.path
  });

  await user.save();
  res.redirect('/login.html');
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.send("User not found");

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.send("Incorrect password");

  req.session.userId = user._id;
  res.redirect('/dashboard.html');
});

app.get('/user', async (req, res) => {
  const user = await User.findById(req.session.userId);
  res.json(user);
});

app.post('/location', async (req, res) => {
  const { latitude, longitude, placeName } = req.body;
  if (!req.session.userId) return res.status(401).send("Unauthorized");

  const location = new Location({
    userId: req.session.userId,
    latitude,
    longitude,
    placeName
  });
  await location.save();
  res.send("Location saved");
});

app.get('/locationKeys', async (req, res) => {
  if (!req.session.userId) return res.status(401).send("Unauthorized");
  const keys = await Location.find({ userId: req.session.userId });
  res.json(keys);
});

app.post('/delete', async (req, res) => {
  await User.findByIdAndDelete(req.session.userId);
  await Location.deleteMany({ userId: req.session.userId });
  req.session.destroy();
  res.redirect('/register.html');
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login.html');
});

// ✅ Start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
