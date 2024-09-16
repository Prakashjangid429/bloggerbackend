// const multer = require('multer');
// const path = require('path');

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, path.join(__dirname, '../uploads'));  // Store in uploads folder
//     },
//     filename: (req, file, cb) => {
//         const timestamp = Date.now();
//         const randomNumber = Math.floor(Math.random() * 10000);
//         const uniqueFilename = `${timestamp}${randomNumber}${path.extname(file.originalname)}`;
//         cb(null, uniqueFilename);
//     },
// });


// const fileFilter = (req, file, cb) => {
//     if (file.mimetype.startsWith('image/')) {
//         cb(null, true);  // Accept file
//     } else {
//         cb(new Error('Invalid file type! Only images are allowed.'), false);  // Reject file
//     }
// };

// const upload = multer({
//     storage: storage,
//     fileFilter: fileFilter,
//     limits: { fileSize: 5 * 1024 * 1024 },
// }).single('image');

// const uploadImage = (req, res) => {
//     upload(req, res, (err) => {
//         if (err) {
//             console.error('Error during upload:', err);
//             return res.status(400).json({ message: 'Image upload failed', error: err.message });
//         }
//         const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
//         console.log(imageUrl)
//         res.status(200).json({ url: imageUrl });
//     });
// };

// module.exports = { uploadImage };



const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: (req, file, cb) => {
        const timestamp = Date.now();
        const randomNumber = Math.floor(Math.random() * 10000);
        const uniqueFilename = `${timestamp}${randomNumber}${path.extname(file.originalname)}`;
        cb(null, uniqueFilename);
    },
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
        cb(null, true); 
    } else {
        cb(new Error('Invalid file type! Only images and videos are allowed.'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 20 * 1024 * 1024 },
}).single('image'); 

const uploadImage = (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            console.error('Error during upload:', err);
            return res.status(400).json({ message: 'File upload failed', error: err.message });
        }
        const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        console.log(fileUrl)
        res.status(200).json({ url: fileUrl });
    });
};

module.exports = { uploadImage };

