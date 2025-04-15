const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://prakashjangid429:LLyAlj0bcUyQoYKr@jdb.epdoitm.mongodb.net/?retryWrites=true&w=majority&appName=jdb');
        console.log('MongoDB connected');
    } catch (err) {
        console.error(err.message);
    }
};

module.exports = connectDB;
