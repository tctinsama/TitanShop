//src/server/server.js
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'mobileecommerce',
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Kết nối tới MySQL thành công');
});

// API đăng nhập
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const query = 'SELECT u.userid, u.fullname, r.rolename FROM user u JOIN role r ON u.userid = r.userid WHERE u.username = ? AND u.password = ?';

    connection.query(query, [username, password], (error, results) => {
        if (error) {
            return res.status(500).json({ success: false, message: 'Có lỗi xảy ra' });
        }

        if (results.length > 0) {
            const user = results[0];
            res.json({ success: true, fullname: user.fullname, rolename: user.rolename });
        } else {
            res.json({ success: false, message: 'Tên đăng nhập hoặc mật khẩu không đúng' });
        }
    });
});


//app.get('/new-products', (req, res) => {
//    console.log("New products API called");
//    const sql = `SELECT p.productid, p.name, IFNULL(CONVERT(pi.image USING utf8), '') AS image,
//                 AVG(c.stars) AS averageStars, q.price
//                 FROM product AS p
//                 LEFT JOIN productimage AS pi ON p.productid = pi.productid
//                 LEFT JOIN comment AS c ON p.productid = c.productid
//                 LEFT JOIN quantity AS q ON p.productid = q.productid
//                 WHERE p.status = 1
//                 GROUP BY p.productid, pi.image, q.price
//                 ORDER BY p.productid DESC LIMIT 10;`;
//
// connection.query(sql, (err, results) => {
//        if (err) {
//            console.error('Database query error:', err); // Ghi lại lỗi nếu có
//            return res.status(500).json({ error: err.message }); // Trả về JSON thay vì HTML
//        }
//
//        console.log('Results from database:', results); // Ghi lại kết quả từ cơ sở dữ liệu
//
//        // Chuyển đổi hình ảnh BLOB sang base64
//        results.forEach(product => {
//            if (product.image) {
//                product.image = Buffer.from(product.image).toString('base64'); // Chuyển đổi BLOB sang base64
//            }
//        });
//
//        console.log('Processed products:', results); // Ghi lại sản phẩm đã được xử lý
//        res.json(results); // Đảm bảo luôn trả về JSON
//    });
//});

app.get('/new-products', (req, res) => {
    // Logic để lấy danh sách sản phẩm mới
    const newProducts = [
        { id: 1, name: "Product 1", price: 100 },
        { id: 2, name: "Product 2", price: 200 }
    ];
    res.json(newProducts); // Trả về danh sách sản phẩm mới dưới dạng JSON
});



// Thêm đoạn này để lắng nghe server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
