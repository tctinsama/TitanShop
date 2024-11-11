const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary'); // Thêm dòng này để import CloudinaryStorage
const multer = require('multer');

// Cấu hình Cloudinary
cloudinary.config({
    cloud_name: 'do0k0jkej',
    api_key: '516587224998934',
    api_secret: 'uNQpra11lkjgy9I0hgOp1Wf2iMA',
});

// Cấu hình lưu trữ cho multer sử dụng Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'products', // Thư mục trong Cloudinary, bạn có thể thay đổi tên này
        allowed_formats: ['jpg', 'png'],
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Lưu tên gốc của file
    }
});

// Khởi tạo multer với storage đã cấu hình
const uploadCloud = multer({ storage: storage });

module.exports = { cloudinary, uploadCloud };
