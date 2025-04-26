const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const app = express();

dotenv.config();

const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected Successfully'))
.catch((err) => console.error('❌ MongoDB Connection Error:', err));

app.use(express.static(path.join(__dirname)));

// Define User model here
const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true // email ek hi baar allowed
    },
    password: {
        type: String,
        default: null // Google login wale users ka password nahi hoga
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model('User', userSchema);

// Create or Check User API
app.post('/api/auth/google', async (req, res) => {
    const { fullName, email } = req.body;

    try {
        let user = await User.findOne({ email });

        if (!user) {
            // Naya user create kar
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

// Server Listen
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
