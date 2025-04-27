const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const http = require('http');
const { Server } = require('socket.io');

// Create HTTP server and attach Socket.IO
const server = http.createServer(app);
const io = new Server(server);

// Store active socket connections
const activeUsers = new Map();
dotenv.config();

const app = express();
const PORT = 3000;

// Cloudinary Config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Multer Storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'Poolmate',
        allowed_formats: ['jpg', 'jpeg', 'png']
    }
});
const upload = multer({ storage: storage });

// Mongoose Connect
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected Successfully'))
    .catch((err) => console.error('❌ MongoDB Connection Error:', err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// User Model
const userSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    password: { type: String, default: null },
    createdAt: { type: Date, default: Date.now }
});
const User = mongoose.model('User', userSchema);

// Ride Offer Model
const rideOfferSchema = new mongoose.Schema({
    driverName: String,
    startingPoint: String,
    destinationPoint: String,
    journeyDate: String,
    journeyTime: String,
    vehicleType: String,
    seatingCapacity: String,
    availableSeats: String,
    seatPrice: String,
    additionalNote: String,
    vehicleName: String,
    vehicleBrand: String,
    vehicleModel: String,
    vehicleColor: String,
    numberPlate: String,
    vehicleImage: String,
    licenseImage: String,
    driverPhoto: String,
    createdAt: { type: Date, default: Date.now }
});
const RideOffer = mongoose.model('RideOffer', rideOfferSchema);

// Auth Google API
app.post('/api/auth/google', async (req, res) => {
    const { fullName, email } = req.body;

    try {
        let user = await User.findOne({ email });

        if (!user) {
            user = new User({ fullName, email });
            await user.save();
            console.log('✅ New Google User created:', fullName);
        } else {
            console.log('ℹ️ Existing user login:', fullName);
        }

        res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
        console.error('❌ Error in Google login API:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// 🚀 NEW API: Offer Ride
app.post('/api/offer', upload.fields([
    { name: 'vehicleImage', maxCount: 1 },
    { name: 'licenseImage', maxCount: 1 },
    { name: 'driverPhoto', maxCount: 1 }
]), async (req, res) => {
    try {
        const { body, files } = req;

        const newOffer = new RideOffer({
            driverName: body.driverName,
            startingPoint: body.startingPoint,
            destinationPoint: body.destinationPoint,
            journeyDate: body.journeyDate,
            journeyTime: body.journeyTime,
            vehicleType: body.vehicleType,
            seatingCapacity: body.seatingCapacity,
            availableSeats: body.availableSeats,
            seatPrice: body.seatPrice,
            additionalNote: body.additionalNote,
            vehicleName: body.vehicleName,
            vehicleBrand: body.vehicleBrand,
            vehicleModel: body.vehicleModel,
            vehicleColor: body.vehicleColor,
            numberPlate: body.numberPlate,
            vehicleImage: files.vehicleImage ? files.vehicleImage[0].path : '',
            licenseImage: files.licenseImage ? files.licenseImage[0].path : '',
            driverPhoto: files.driverPhoto ? files.driverPhoto[0].path : ''
        });

        await newOffer.save();
        res.status(201).json({ message: 'Offer Created Successfully 🚀' });

    } catch (error) {
        console.error('❌ Error creating offer:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.get('/api/rides', async (req, res) => {
    try {
        const rides = await RideOffer.find({});
        res.json(rides);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

app.get("/api/search-rides", async (req, res) => {
    try {
        const { startingPoint, destinationPoint } = req.query

        if (!startingPoint || !destinationPoint) {
            return res.status(400).json({ message: "Starting point and destination point are required" })
        }

        // Create a search query with case-insensitive regex matching
        const searchQuery = {
            startingPoint: { $regex: startingPoint, $options: "i" },
            destinationPoint: { $regex: destinationPoint, $options: "i" },
        }

        const rides = await RideOffer.find(searchQuery)

        res.json(rides)
    } catch (err) {
        console.error("❌ Error searching rides:", err)
        res.status(500).json({ message: "Server Error" })
    }
})

// Server Start
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
