const fs = require('fs');
const path = require('path');
const Blog = require('../models/blog.model');

const imageExtensions = new Set(['.jpg', '.jpeg', '.png', '.gif']);

const extractImageFilenamesFromContent = (content) => {
    const regex = /<img[^>]+src="([^">]+)"/g; // Regex to find image src in content
    const filenames = [];
    let match;

    while ((match = regex.exec(content)) !== null) {
        const filename = path.basename(match[1]); // Extract filename from URL
        filenames.push(filename);
    }

    return filenames;
};

const getFileExtension = (filename) => {
    return path.extname(filename).toLowerCase();
};

const deleteUnusedImages = async (req, res) => {
    try {
        const uploadDir = path.join(__dirname, '../uploads');
        const blogs = await Blog.find().select('image_url content');

        const usedImageFilenames = new Set();

        blogs.forEach(blog => {
            if (blog.image_url) {
                usedImageFilenames.add(path.basename(blog.image_url));
            }

            if (blog.content) {
                const contentImages = extractImageFilenamesFromContent(blog.content);
                contentImages.forEach(image => usedImageFilenames.add(image));
            }
        });

        fs.readdir(uploadDir, (err, files) => {
            if (err) {
                console.error('Error reading upload directory:', err);
                return res.status(500).json({ message: 'Server error' });
            }

            // Filter only image files
            const unusedImages = files
                .filter(file => imageExtensions.has(getFileExtension(file)) && !usedImageFilenames.has(file));

            unusedImages.forEach(image => {
                fs.unlink(path.join(uploadDir, image), (err) => {
                    if (err) {
                        console.error('Error deleting file:', image, err);
                    } else {
                        console.log('Deleted unused image:', image);
                    }
                });
            });
            res.status(200).json({unusedImages });
        });
    } catch (err) {
        console.error('Error during unused images cleanup:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { deleteUnusedImages };
