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
//src/server/server.js
// Express.js route
app.post('/api/reset-password', async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).send("Email không tồn tại.");
    }

    const token = generateResetToken(user); // Tạo token khôi phục
    await sendEmail(user.email, token); // Gửi email khôi phục

    res.send("Email khôi phục mật khẩu đã được gửi!");
});

// API để khôi phục mật khẩu
app.post('/api/reset-password/:token', async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const user = verifyResetToken(token); // Kiểm tra token
    user.password = hashPassword(password); // Mã hóa mật khẩu mới
    await user.save();

    res.send("Mật khẩu đã được khôi phục thành công!");
});

// API đăng ký
app.post('/register', (req, res) => {
    const { username, password, fullname, phonenumber, address, email, dayofbirth } = req.body;
    console.log('Received data:', req.body);
    // Kiểm tra xem tên người dùng đã tồn tại hay chưa
    connection.query('SELECT * FROM user WHERE username = ?', [username], (error, results) => {
        if (error) {
            console.error('Error querying database for existing user:', error);
            return res.status(500).json({ success: false, message: 'Có lỗi xảy ra' });
        }

        if (results.length > 0) {
            return res.json({ success: false, message: 'Tên người dùng đã tồn tại' });
        }

        // Tạo người dùng mới
        const newUser = {
            userid: null, // NULL nếu bạn đang sử dụng AUTO_INCREMENT trong cơ sở dữ liệu
            username,
            password,
            fullname,
            phonenumber,
            address,
            email,
            dayofbirth,
            img: null, // Bạn có thể để NULL hoặc một giá trị mặc định
            status: 1, // 1 có thể biểu thị tài khoản đang hoạt động
        };

        connection.query('INSERT INTO user SET ?', newUser, (err, result) => {
            if (err) {
                console.error('Error inserting new user:', err);
                return res.status(500).json({ success: false, message: 'Có lỗi xảy ra khi đăng ký' });
            }

            const newRole = {
                roleid: null, // NULL nếu bạn đang sử dụng AUTO_INCREMENT
                rolename: 'customer',
                approval: 1,
                userid: result.insertId, // Lấy userid vừa được tạo
            };

            connection.query('INSERT INTO role SET ?', newRole, (err) => {
                if (err) {
                    return res.status(500).json({ success: false, message: 'Có lỗi xảy ra khi phân quyền' });
                }

                return res.json({ success: true, message: 'Đăng ký thành công' });
            });
        });
    });
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


// API tải giỏ hàng
app.get('/api/cart/:userid', (req, res) => {
    const { userid } = req.params;
    const query = `
        SELECT ci.cartitemid, p.productid, p.name, ci.size, ci.color, ci.price, ci.quantity, p.image
        FROM cartitem ci
        JOIN product p ON ci.productid = p.productid
        JOIN cart c ON ci.cartid = c.cartid
        WHERE c.userid = ? AND c.status = 1;
    `;

    connection.query(query, [userid], (error, results) => {
        if (error) {
            console.error('Database error:', error);
            return res.status(500).json({ success: false, message: 'Có lỗi xảy ra khi tải giỏ hàng' });
        }

        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'Giỏ hàng của bạn trống' });
        }

        const cleanedResults = results.map(item => ({
            ...item,
            image: item.image ? item.image.toString('base64') : null,
        }));

        res.json({ success: true, cartItems: cleanedResults });
    });
});

// API thêm sản phẩm vào giỏ hàng
app.post('/api/cart/add', (req, res) => {
    const { userid, productid, size, color, quantity, price } = req.body;

    // Kiểm tra nếu người dùng đã có giỏ hàng chưa
    const cartQuery = 'SELECT cartid FROM cart WHERE userid = ? AND status = 1';
    connection.query(cartQuery, [userid], (cartError, cartResults) => {
        if (cartError) {
            console.error('Error while checking cart:', cartError);
            return res.status(500).json({ message: 'Lỗi khi kiểm tra giỏ hàng', cartError });
        }

        let cartid;
        if (cartResults.length > 0) {
            cartid = cartResults[0].cartid;
            checkProductInCart(cartid);
        } else {
            // Tạo giỏ hàng mới nếu chưa có
            const newCartQuery = 'INSERT INTO cart (userid, status) VALUES (?, 1)';
            connection.query(newCartQuery, [userid], (newCartError, newCartResults) => {
                if (newCartError) {
                    console.error('Error while creating new cart:', newCartError);
                    return res.status(500).json({ message: 'Lỗi khi tạo giỏ hàng mới', newCartError });
                }
                cartid = newCartResults.insertId;
                addItemToCart(cartid);
            });
        }
    });

    // Kiểm tra nếu sản phẩm đã có trong giỏ hàng
    function checkProductInCart(cartid) {
        const checkQuery = 'SELECT * FROM cartitem WHERE cartid = ? AND productid = ? AND size = ? AND color = ?';
        connection.query(checkQuery, [cartid, productid, size, color], (error, results) => {
            if (error) {
                console.error('Error checking product in cart:', error);
                return res.status(500).json({ message: 'Lỗi kiểm tra sản phẩm trong giỏ hàng', error });
            }

            if (results.length > 0) {
                // Nếu sản phẩm đã có, cập nhật số lượng
                const updatedQuantity = results[0].quantity + quantity;
                updateProductInCart(results[0].cartitemid, updatedQuantity);
            } else {
                addItemToCart(cartid);
            }
        });
    }

    // Thêm sản phẩm vào giỏ hàng
    function addItemToCart(cartid) {
        const query = `
            INSERT INTO cartitem (cartid, productid, size, color, quantity, price, status) 
            VALUES (?, ?, ?, ?, ?, ?, 1)
        `;
        connection.query(query, [cartid, productid, size, color, quantity, price], (error, results) => {
            if (error) {
                console.error('Error while adding product to cart:', error);
                return res.status(500).json({ message: 'Lỗi khi thêm sản phẩm vào giỏ hàng', error });
            }
            res.status(200).json({ message: 'Thêm sản phẩm vào giỏ hàng thành công', cartItemId: results.insertId });
        });
    }

    // Cập nhật số lượng sản phẩm trong giỏ hàng
    function updateProductInCart(cartitemid, updatedQuantity) {
        const updateQuery = 'UPDATE cartitem SET quantity = ? WHERE cartitemid = ?';
        connection.query(updateQuery, [updatedQuantity, cartitemid], (error, results) => {
            if (error) {
                console.error('Error while updating product in cart:', error);
                return res.status(500).json({ message: 'Lỗi khi cập nhật sản phẩm trong giỏ hàng', error });
            }
            res.status(200).json({ message: 'Cập nhật sản phẩm vào giỏ hàng thành công', cartItemId: cartitemid });
        });
    }
});

// API cập nhật số lượng sản phẩm trong giỏ hàng
app.put('/api/cart/update/:cartitemid', (req, res) => {
    const { cartitemid } = req.params;
    const { cartquantity } = req.body;

    console.log('Update request received for cart item:', cartitemid, 'with quantity:', cartquantity);

    // Kiểm tra nếu `cartquantity` không hợp lệ
    if (!cartquantity || isNaN(cartquantity) || cartquantity <= 0) {
        console.error('Invalid quantity:', cartquantity);
        return res.status(400).json({ message: 'Số lượng không hợp lệ' });
    }

    const query = 'UPDATE cartitem SET quantity = ? WHERE cartitemid = ? AND status = 1';

    connection.query(query, [cartquantity, cartitemid], (error, results) => {
        if (error) {
            console.error('Error while updating cart quantity:', error);
            // Đảm bảo trả về phản hồi JSON khi có lỗi
            return res.status(500).json({ message: 'Lỗi khi cập nhật số lượng sản phẩm trong giỏ hàng', error });
        }

        if (results.affectedRows === 0) {
            console.error('No item found to update for cart item:', cartitemid);
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm để cập nhật' });
        }

        console.log('Successfully updated cart item:', cartitemid);
        // Đảm bảo trả về phản hồi JSON khi cập nhật thành công
        res.status(200).json({ message: 'Cập nhật số lượng sản phẩm thành công' });
    });
});



// API xóa sản phẩm khỏi giỏ hàng
app.delete('/api/cart/remove/:cartitemid', (req, res) => {
    const { cartitemid } = req.params;

    const deleteQuery = 'DELETE FROM cartitem WHERE cartitemid = ?';
    connection.query(deleteQuery, [cartitemid], (error, results) => {
        if (error) {
            console.error('Error while deleting cart item:', error);
            return res.status(500).json({ message: 'Lỗi khi xóa sản phẩm khỏi giỏ hàng', error });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm để xóa' });
        }

        res.status(200).json({ message: 'Xóa sản phẩm khỏi giỏ hàng thành công' });
    });
});



// POST: Tạo đơn hàng
//src/server/server.js
// src/server/server.js
app.post('/api/order/create', (req, res) => {
    const { userId, address, phoneNumber, totalPayment, cartItems, voucherCode } = req.body;

    const getUserQuery = 'SELECT fullname FROM user WHERE userid = ?';

    // Bắt đầu transaction
    connection.beginTransaction((transactionError) => {
        if (transactionError) {
            console.error('Lỗi khởi tạo transaction:', transactionError);
            return res.status(500).json({ message: 'Lỗi khởi tạo giao dịch' });
        }

        // Truy vấn để lấy tên người dùng
        connection.query(getUserQuery, [userId], (userError, userResults) => {
            if (userError || userResults.length === 0) {
                console.error('Lỗi khi lấy thông tin người dùng:', userError || 'Không tìm thấy người dùng');
                return connection.rollback(() => {
                    res.status(500).json({ message: 'Lỗi khi lấy thông tin người dùng' });
                });
            }

            const userName = userResults[0].fullname;

            // Thêm dữ liệu vào bảng `order`
            const orderQuery = `
                INSERT INTO \`order\` (orderdate, orderstatusid, voucherCode, total, userid, name, phonenumber, address, status)
                VALUES (CURDATE(), ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            const orderValues = [
                1, // orderstatusid: 1 là "chờ xác nhận"
                voucherCode || null,
                totalPayment,
                userId,
                userName,
                phoneNumber,
                address,
                1 // status: 1 là "active"
            ];

            connection.query(orderQuery, orderValues, (orderError, orderResults) => {
                if (orderError) {
                    console.error('Lỗi khi thêm đơn hàng:', orderError);
                    return connection.rollback(() => {
                        res.status(500).json({ message: 'Lỗi khi thêm đơn hàng' });
                    });
                }

                const orderCode = orderResults.insertId; // Lấy mã đơn hàng vừa tạo

                // ** Bước 1: Truy vấn để lấy thông tin size, color, và brand từ bảng `quantity` và `brand` **
                const orderDetailsData = [];

                const quantityQueries = cartItems.map(item => {
                    return new Promise((resolve, reject) => {
                        const quantityQuery = `
                            SELECT q.size, q.color, b.brandname AS brand
                            FROM quantity q
                            JOIN brand b ON q.productid = ?
                            WHERE q.productid = ?
                        `;
                        connection.query(quantityQuery, [item.productid, item.productid], (quantityError, quantityResults) => {
                            if (quantityError || quantityResults.length === 0) {
                                return reject('Lỗi khi lấy thông tin size, color hoặc brand');
                            }

                            const { size, color, brand } = quantityResults[0];

                            // ** Bước 2: Thêm thông tin vào orderDetailsData **
                            orderDetailsData.push([
                                orderCode,
                                item.productid,
                                size,  // size từ bảng quantity
                                color, // color từ bảng quantity
                                item.quantity > 0 ? item.quantity : 1,
                                brand || 'unknown' // brand từ bảng brand
                            ]);

                            resolve();
                        });
                    });
                });

                // Chờ tất cả các truy vấn hoàn thành
                Promise.all(quantityQueries)
                    .then(() => {
                        // ** Bước 3: Thêm dữ liệu vào `orderdetails` **
                        const orderDetailsQuery = `
                            INSERT INTO orderdetails (ordercode, productid, size, color, quantity, brand)
                            VALUES ?
                        `;

                        connection.query(orderDetailsQuery, [orderDetailsData], (detailsError) => {
                            if (detailsError) {
                                console.error('Lỗi khi thêm chi tiết đơn hàng:', detailsError);
                                return connection.rollback(() => {
                                    res.status(500).json({ message: 'Lỗi khi thêm chi tiết đơn hàng' });
                                });
                            }

                            // Commit transaction nếu thành công
                            connection.commit((commitError) => {
                                if (commitError) {
                                    console.error('Lỗi khi commit transaction:', commitError);
                                    return connection.rollback(() => {
                                        res.status(500).json({ message: 'Lỗi khi hoàn tất giao dịch' });
                                    });
                                }

                                res.status(200).json({
                                    success: true,
                                    orderCode,
                                    message: 'Đặt hàng thành công!'
                                });
                            });
                        });
                    })
                    .catch(err => {
                        console.error(err);
                        return connection.rollback(() => {
                            res.status(500).json({ message: 'Lỗi khi lấy thông tin size, color hoặc brand' });
                        });
                    });
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
    if (!item.productid || !item.name || item.productPrice == null) {
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

app.get('/api/search', (req, res) => {
    const { search } = req.query;

    console.log('search:', search);

    let query = `
        SELECT p.productid, p.name, p.productdes, p.price, p.image, c.categoryname
        FROM product p
        LEFT JOIN category c ON p.categoryproductid = c.categoryproductid
        WHERE 1=1
    `;
    const params = [];

    if (search && search.trim()) {
        query += ' AND (p.name LIKE ? OR c.categoryname LIKE ?)';
        const searchTerm = `%${search.trim()}%`;
        params.push(searchTerm, searchTerm);
    }

    console.log('Final Query:', query);
    console.log('Params:', params);

    connection.query(query, params, (error, results) => {
        if (error) {
            console.error('Database error:', error);
            return res.status(500).json({ success: false, message: 'Có lỗi xảy ra khi tìm kiếm sản phẩm' });
        }

        const cleanedResults = results.map(product => ({
            ...product,
            image: product.image ? product.image.toString('base64') : null
        }));

        res.json({ success: true, results: cleanedResults });
    });
});

// API tải sản phẩm theo danh mục
app.get('/api/products/category/:categoryId', (req, res) => {
    const categoryId = req.params.categoryId;
    const query = 'SELECT productid, name, productdes, price, image FROM product WHERE categoryproductid = ?';

    connection.query(query, [categoryId], (error, results) => {
        if (error) {
            console.error('Database error:', error);
            return res.status(500).json({ message: 'Có lỗi xảy ra khi tải sản phẩm theo danh mục', success: false });
        }

        const cleanedResults = results.map(product => ({
            ...product,
            image: product.image ? product.image.toString('base64') : null // Chuyển đổi Buffer sang base64
        }));

        res.json(cleanedResults); // Trả về danh sách sản phẩm theo danh mục
    });
});


// API LẤY COLOR AND SIZE
app.get('/api/products/:productId/attributes', (req, res) => {
    const { productId } = req.params;

    const query = `SELECT DISTINCT size, color FROM quantity WHERE productid = ?`;
    connection.query(query, [productId], (error, results) => {
        if (error) {
            console.error('Error fetching product attributes:', error);
            return res.status(500).json({ success: false, message: 'Error fetching product attributes' });
        }

        res.json({ success: true, attributes: results });
    });
});


// Bắt đầu lắng nghe server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});