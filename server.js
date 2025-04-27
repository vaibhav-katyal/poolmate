// -------- IMPORTS --------
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { Server } = require('socket.io');

// -------- CONFIGS --------
dotenv.config();
const app = express(); // ✅ app first
const PORT = 3000;
const server = http.createServer(app); // ✅ create server after app
const io = new Server(server); // ✅ bind io with server
const activeUsers = new Map();

// -------- MONGODB CONNECT --------
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected Successfully'))
    .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// -------- MIDDLEWARES --------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// -------- CLOUDINARY & MULTER SETUP --------
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'Poolmate',
        allowed_formats: ['jpg', 'jpeg', 'png']
    }
});
const upload = multer({ storage: storage });

// -------- SCHEMAS & MODELS --------
const userSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    password: { type: String, default: null },
    createdAt: { type: Date, default: Date.now }
});
const User = mongoose.model('User', userSchema);

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

const negotiationSchema = new mongoose.Schema({
    rideId: mongoose.Schema.Types.ObjectId,
    userId: mongoose.Schema.Types.ObjectId,
    offerPrice: Number,
    status: { type: String, default: "pending" },
    counterPrice: Number,
    createdAt: { type: Date, default: Date.now }
});
const Negotiation = mongoose.model('Negotiation', negotiationSchema);

// -------- SOCKET.IO HANDLERS --------
io.on('connection', (socket) => {
    console.log('✅ User connected:', socket.id);

    socket.on('register', (userId) => {
        activeUsers.set(userId, socket.id);
        console.log('✅ Registered userId:', userId);
    });

    socket.on('disconnect', () => {
        console.log('❌ User disconnected:', socket.id);
        for (const [userId, socketId] of activeUsers.entries()) {
            if (socketId === socket.id) {
                activeUsers.delete(userId);
                break;
            }
        }
    });

    socket.on('accept-offer', async ({ negotiationId }) => {
        const negotiation = await Negotiation.findById(negotiationId);
        if (negotiation) {
            negotiation.status = 'accepted';
            await negotiation.save();

            const userSocketId = activeUsers.get(negotiation.userId.toString());
            if (userSocketId) {
                io.to(userSocketId).emit('offer-accepted', { message: '🎉 Your offer was accepted!' });
            }
        }
    });

    socket.on('reject-offer', async ({ negotiationId }) => {
        const negotiation = await Negotiation.findById(negotiationId);
        if (negotiation) {
            negotiation.status = 'rejected';
            await negotiation.save();

            const userSocketId = activeUsers.get(negotiation.userId.toString());
            if (userSocketId) {
                io.to(userSocketId).emit('offer-rejected', { message: '❌ Your offer was rejected.' });
            }
        }
    });

    socket.on('counter-offer', async ({ negotiationId, counterPrice }) => {
        const negotiation = await Negotiation.findById(negotiationId);
        if (negotiation) {
            negotiation.status = 'counter';
            negotiation.counterPrice = counterPrice;
            await negotiation.save();

            const userSocketId = activeUsers.get(negotiation.userId.toString());
            if (userSocketId) {
                io.to(userSocketId).emit('offer-counter', { negotiationId, counterPrice });
            }
        }
    });
});

// -------- ROUTES / APIs --------
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
        console.error('❌ Error in Google login:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

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
        const { startingPoint, destinationPoint } = req.query;

        if (!startingPoint || !destinationPoint) {
            return res.status(400).json({ message: "Starting point and destination point are required" });
        }

        const rides = await RideOffer.find({
            startingPoint: { $regex: startingPoint, $options: "i" },
            destinationPoint: { $regex: destinationPoint, $options: "i" }
        });

        res.json(rides);
    } catch (err) {
        console.error("❌ Error searching rides:", err);
        res.status(500).json({ message: "Server Error" });
    }
});

app.post('/api/negotiate', async (req, res) => {
    try {
        const { rideId, userId, offerPrice } = req.body;

        const negotiation = new Negotiation({
            rideId,
            userId,
            offerPrice
        });

        await negotiation.save();

        const ride = await RideOffer.findById(rideId);
        const driverSocketId = activeUsers.get(ride.driverName);

        if (driverSocketId) {
            io.to(driverSocketId).emit('incoming-negotiation', {
                negotiationId: negotiation._id,
                offerPrice,
                userId
            });
        }

        res.json({ success: true, negotiation });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Negotiation failed" });
    }
});

// -------- SERVER START --------
server.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
