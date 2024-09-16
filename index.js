const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const connectDB = require('./config/db.config');
const authRoutes = require('./routes/auth.routes');
const blogRoutes = require('./routes/blog.routes');
const categoryRoutes = require('./routes/category.routes');
const contactRoutes = require('./routes/contact.routes');
const cleanupRoutes = require('./routes/cleanup.routes');



const path = require('path');
const uploadRoutes = require('./routes/upload.routes');
const cors = require('cors');

const app = express();
dotenv.config();

connectDB();

app.use(bodyParser.json());
app.use(cors());

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api', uploadRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api', contactRoutes);
app.use('/api', cleanupRoutes);



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;
