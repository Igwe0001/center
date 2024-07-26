const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname)));

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 30000, 
  })
  .then(() => {
    console.log("MongoDB connected successfully.");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Schema and Model for Bookings
const bookingSchema = new mongoose.Schema({
  name: String,
  email: String,
  room: String,
  date: String,
  time: String,
  purpose: String,
});

const Booking = mongoose.model("Booking", bookingSchema);

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html")); 
});

app.post("/api/book-room", async (req, res) => {
  const { name, email, room, date, time, purpose } = req.body;

  try {
    const newBooking = new Booking({ name, email, room, date, time, purpose });
    await newBooking.save();

    // Send confirmation email
    const transporter = nodemailer.createTransport({
      service: "gmail", 
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Room Booking Confirmation",
      text: `Hello ${name},\n\nYour booking for ${room} on ${date} at ${time} has been confirmed.\n\nPurpose: ${purpose}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });

    res
      .status(200)
      .send("Booking saved and confirmation email sent successfully.");
  } catch (error) {
    console.error("Error saving booking:", error);
    res.status(500).send("Error saving booking.");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
