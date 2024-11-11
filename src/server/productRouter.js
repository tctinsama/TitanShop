const express = require('express');
const { uploadCloud } = require('./cloudinaryConfig'); // Đảm bảo đường dẫn này đúng
const router = express.Router();

router.post('/products', uploadCloud.single('image'), (req, res) => {
    const { name, description, price, category, userId, brandid } = req.body;
    const connection = req.app.locals.connection; // Sử dụng connection từ app.locals

    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    if (!name || !description || !price || !category || !req.file) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const imageUrl = req.file.path;

   

        // Nếu brandid tồn tại, tiếp tục thêm sản phẩm
        const query = `
            INSERT INTO product (name, productdes, price, categoryproductid, userid, status, image)
            VALUES (?, ?, ?, ?, ?, 1, ?)
        `;

        connection.query(query, [name, description, price, category, userId, imageUrl], (error, results) => {
            if (error) {
                console.error('Error adding product:', error.message);
                return res.status(500).json({ error: 'An error occurred while adding the product', details: error.message });
            }

            res.json({ message: 'Product added successfully', productId: results.insertId, imageUrl: imageUrl });
        });
    });


module.exports = router;
