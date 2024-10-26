//src/server/server.js
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Kết nối đến cơ sở dữ liệu MySQL
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'mobileecommerce',
});

// Kết nối đến MySQL
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
            res.json({ success: true, userid: user.userid, fullname: user.fullname, rolename: user.rolename });
        } else {
            res.json({ success: false, message: 'Tên đăng nhập hoặc mật khẩu không đúng' });
        }
    });
});

// API tải sản phẩm
app.get('/products', (req, res) => {
    const query = 'SELECT productid, name, productdes, price, image FROM product';

    connection.query(query, (error, results) => {
        if (error) {
            console.error('Database error:', error);
            return res.status(500).json({ message: 'Có lỗi xảy ra khi tải sản phẩm', success: false });
        }

        // Chuyển đổi hình ảnh từ Buffer sang base64
        const cleanedResults = results.map(product => {
            return {
                ...product,
                image: product.image ? product.image.toString('base64') : null // Chuyển đổi Buffer sang base64
            };
        });

        res.json(cleanedResults); // Trả về danh sách sản phẩm
    });
});

// API tải danh mục
app.get('/categories', (req, res) => {
    const query = 'SELECT categoryproductid, categoryname, categorydes, categoryImage FROM category WHERE status = 1';

    connection.query(query, (error, results) => {
        if (error) {
            console.error('Database error:', error);
            return res.status(500).json({ message: 'Có lỗi xảy ra khi tải danh mục', success: false });
        }

        // Chuyển đổi hình ảnh từ Buffer sang base64
        const cleanedResults = results.map(category => {
            return {
                ...category,
                categoryImage: category.categoryImage ? category.categoryImage.toString('base64') : null
            };
        });

        res.json(cleanedResults); // Trả về danh sách danh mục
    });
});
//src/server/server.js
// API tải giỏ hàng
// API lấy danh sách sản phẩm trong giỏ hàng của người dùng
// API tải giỏ hàng
app.get('/cart/:userid', (req, res) => {
    const userid = req.params.userid;
    const query = `
        SELECT p.productid, p.name AS productName, p.price AS productPrice, c.cartquantity, p.image AS productImage, c.cartid
        FROM cart c
        JOIN product p ON c.productid = p.productid
        WHERE c.userid = ? AND c.status = 'active'
    `;

    connection.query(query, [userid], (error, results) => {
        if (error) {
            console.error('Database error:', error);
            return res.status(500).json({ success: false, message: 'Có lỗi xảy ra khi tải giỏ hàng' });
        }

        // Chuyển đổi hình ảnh từ Buffer sang base64 nếu có giá trị
        const cleanedResults = results.map(item => {
            return {
                ...item,
                productImage: item.productImage ? item.productImage.toString('base64') : null
            };
        });

        res.json({ success: true, cartItems: cleanedResults });
    });
});

// API thêm sản phẩm vào giỏ hàng
app.post('/api/cart/add', (req, res) => {
    const { userid, productid, cartquantity } = req.body;
    const status = 'active'; // Trạng thái của sản phẩm trong giỏ hàng khi thêm vào
    const query = 'INSERT INTO cart (userid, productid, cartquantity, status) VALUES (?, ?, ?, ?)';

    connection.query(query, [userid, productid, cartquantity, status], (error, results) => {
        if (error) {
            console.error('Error while adding product to cart:', error);

            return res.status(500).json({ message: 'Lỗi khi thêm sản phẩm vào giỏ hàng', error });
        }
        res.status(200).json({ message: 'Thêm sản phẩm vào giỏ hàng thành công', cartId: results.insertId });
    });
});

// API cập nhật số lượng sản phẩm trong giỏ hàng
app.put('/api/cart/update/:cartid', (req, res) => {
    const { cartid } = req.params;
    const { cartquantity } = req.body;

    const query = 'UPDATE cart SET cartquantity = ? WHERE cartid = ? AND status = "active"';

    connection.query(query, [cartquantity, cartid], (error, results) => {
        if (error) {
            console.error('Error while updating cart quantity:', error);
            return res.status(500).json({ message: 'Lỗi khi cập nhật số lượng sản phẩm trong giỏ hàng', error });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm để cập nhật' });
        }

        res.status(200).json({ message: 'Cập nhật số lượng sản phẩm thành công' });
    });
});

// API xóa sản phẩm khỏi giỏ hàng
app.delete('/api/cart/remove/:cartid', (req, res) => {
    const { cartid } = req.params;
    const query = 'DELETE FROM cart WHERE cartid = ?';

    connection.query(query, [cartid], (error, results) => {
        if (error) {
            console.error('Error while adding product to cart:', error);

            return res.status(500).json({ message: 'Lỗi khi xóa sản phẩm khỏi giỏ hàng', error });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm để xóa' });
        }
        res.status(200).json({ message: 'Xóa sản phẩm khỏi giỏ hàng thành công' });
    });
});
// POST: Tạo đơn hàng
// POST: Tạo đơn hàng
// POST: Tạo đơn hàng
//src/server/server.js
app.post('/api/order/create', (req, res) => {
    const { userId, address, phoneNumber, totalPayment, cartItems } = req.body;
    console.log('Dữ liệu nhận được từ client:', req.body); // Log toàn bộ dữ liệu nhận được

    // Lấy tên người dùng từ bảng user dựa trên userId
    const userQuery = 'SELECT fullname FROM user WHERE userid = ?';

    connection.query(userQuery, [userId], (userError, userResults) => {
        if (userError) {
            console.error('Lỗi khi truy vấn thông tin người dùng:', userError);
            return res.status(500).json({ message: 'Lỗi lấy thông tin người dùng' });
        }

        if (userResults.length === 0) {
            console.error('Không tìm thấy người dùng với userId:', userId);
            return res.status(404).json({ message: 'Người dùng không tồn tại' });
        }

        const userName = userResults[0].fullname;
        const orderStatusId = 1; // Order status mặc định = 1 (Chờ xác nhận)

        // Tạo đơn hàng mới
        const orderQuery = `
            INSERT INTO \`order\` (userid, address, phonenumber, total, orderstatusid, name)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        const values = [userId, address, phoneNumber, totalPayment, orderStatusId, userName];

        connection.query(orderQuery, values, (orderError, orderResults) => {
            if (orderError) {
                console.error('Lỗi khi tạo đơn hàng:', orderError);
                return res.status(500).json({ message: 'Thanh toán không thành công' });
            }

            console.log('Đơn hàng được tạo thành công với ID:', orderResults.insertId);
            const orderCode = orderResults.insertId; // Lấy ID của đơn hàng vừa tạo

            // Kiểm tra xem giỏ hàng có dữ liệu không
            if (!cartItems || cartItems.length === 0) {
                console.error('Giỏ hàng trống!'); // Log lỗi giỏ hàng trống
                return res.status(400).json({ message: 'Giỏ hàng trống!' });
            }

            // Lưu chi tiết đơn hàng
            const orderDetailsData = cartItems.map(item => [
                orderCode, item.productId, item.size || 'default', item.color || 'default',
                item.brand || 'unknown', item.quantity > 0 ? item.quantity : 1
            ]);

            const orderDetailsQuery = `
                INSERT INTO orderdetails (ordercode, productid, size, color, brand, quantity)
                VALUES ?
            `;

            connection.query(orderDetailsQuery, [orderDetailsData], (detailsError) => {
                if (detailsError) {
                    console.error('Lỗi khi thêm chi tiết đơn hàng:', detailsError);
                    return res.status(500).json({ message: 'Lỗi khi thêm chi tiết đơn hàng' });
                }
                res.status(200).json({ message: 'Đặt hàng thành công!' });
            });


            connection.query(orderDetailsQuery, [orderDetailsData], (detailsError) => {
                if (detailsError) {
                    console.error('Lỗi khi lưu chi tiết đơn hàng:', detailsError);
                    return res.status(500).json({ message: 'Lỗi lưu chi tiết đơn hàng' });
                }

                res.status(200).json({ message: 'Đặt hàng thành công', orderCode });
            });
        });
    });
});

app.post('/payment', (req, res) => {
  const { cartItems } = req.body;

  if (!cartItems || cartItems.length === 0) {
    return res.status(400).json({ success: false, message: 'Giỏ hàng trống.' });
  }

  for (const item of cartItems) {
    if (!item.productid || !item.productName || item.productPrice == null) {
      return res.status(400).json({ success: false, message: 'Sản phẩm không hợp lệ.' });
    }
  }

  // Xử lý thanh toán thành công
  return res.status(200).json({ success: true, message: 'Thanh toán thành công.' });
});



app.get('/api/user/:userId', (req, res) => {
    const userId = req.params.userId;
    const query = 'SELECT userid, fullname, username, email, phonenumber, address FROM user WHERE userid = ?';

    connection.query(query, [userId], (error, results) => {
        if (error) {
            console.error('Lỗi khi lấy thông tin người dùng:', error);
            return res.status(500).json({ success: false, message: 'Lỗi lấy thông tin người dùng' });
        }
        res.status(200).json(results[0]); // Trả về kết quả đầu tiên
    });
});



// Bắt đầu lắng nghe server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});