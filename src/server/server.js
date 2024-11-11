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

// POST /api/register
app.post('/api/register', async (req, res) => {
    const { username, password, fullname, phonenumber, address, email, dayofbirth, status, roleid } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!username || !password || !fullname || !phonenumber || !email || !dayofbirth) {
        return res.status(400).json({ success: false, message: 'Thông tin thiếu' });
    }

    try {
        // Kiểm tra xem tên người dùng đã tồn tại chưa
        const checkUserQuery = 'SELECT * FROM user WHERE username = ?';
        const [userResults] = await new Promise((resolve, reject) => {
            connection.query(checkUserQuery, [username], (error, results) => {
                if (error) {
                    console.error('Lỗi khi kiểm tra tên người dùng:', error);
                    return reject(error);
                }
                resolve(results);
            });
        });

        // Kiểm tra nếu userResults không phải là mảng hoặc có độ dài > 0
        if (Array.isArray(userResults) && userResults.length > 0) {
            return res.status(400).json({ success: false, message: 'Tên người dùng đã tồn tại' });
        }

        // Mặc định giá trị 'status' là 1 nếu không có
        const userStatus = status || 1;  // Nếu không có status, mặc định là 1
        const userRole = roleid || 4;    // Nếu không có roleid, mặc định là 4

        // Thêm người dùng vào bảng 'user'
        const insertQuery = 'INSERT INTO user (username, password, fullname, phonenumber, address, email, dayofbirth, status, roleid) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
        await new Promise((resolve, reject) => {
            connection.query(insertQuery, [username, password, fullname, phonenumber, address, email, dayofbirth, userStatus, userRole], (error, results) => {
                if (error) {
                    console.error('Lỗi khi thêm người dùng:', error);
                    return reject(error);
                }
                resolve(results);
            });
        });

        res.status(201).json({ success: true, message: 'Tạo tài khoản thành công' });

    } catch (error) {
        console.error('Lỗi khi đăng ký:', error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
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


app.get('/api/groupcart/:userid', (req, res) => {
    const { userid } = req.params;

    // Query để lấy thông tin các sản phẩm trong giỏ hàng, phân theo shop
    const query = `

        SELECT ci.cartitemid, p.productid, p.name, ci.size, ci.color, ci.price, ci.quantity, p.image, u.fullname AS shopName, p.userid AS shopUserId
        FROM cartitem ci
        JOIN product p ON ci.productid = p.productid
        JOIN cart c ON ci.cartid = c.cartid
        JOIN user u ON p.userid = u.userid
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

        // Tạo đối tượng để nhóm sản phẩm theo shop
        const groupedCartItems = results.reduce((acc, item) => {
            // Kiểm tra nếu shop đã có trong nhóm, nếu chưa thì tạo nhóm mới
            if (!acc[item.shopUserId]) {
                acc[item.shopUserId] = {
                    shopName: item.shopName,
                    products: []
                };
            }
            // Thêm sản phẩm vào nhóm shop tương ứng
            acc[item.shopUserId].products.push({
                cartitemid: item.cartitemid,
                productid: item.productid,
                name: item.name,
                size: item.size,
                color: item.color,
                price: item.price,
                quantity: item.quantity,
                image: item.image ? item.image.toString('base64') : null
            });
            return acc;
        }, {});

        // Chuyển nhóm dữ liệu thành mảng để dễ dàng trả về client
        const cartItemsGroupedByShop = Object.values(groupedCartItems);

        res.json({ success: true, cartItems: cartItemsGroupedByShop });
    });
});


//src/server/server.js

// API tải giỏ hàng

app.get('/api/cart/:userid', (req, res) => {
    const { userid } = req.params;
    const query = `
        SELECT ci.cartitemid, p.productid, p.name, ci.size, ci.color, ci.price, ci.quantity, p.image, u.username AS shopName, p.userid
        FROM cartitem ci
        JOIN product p ON ci.productid = p.productid
        JOIN cart c ON ci.cartid = c.cartid
        JOIN user u ON p.userid = u.userid
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

app.post('/api/order/create', (req, res) => {
    const { userId, address,name, phoneNumber, totalPayment, cartItems, voucherCode } = req.body;

    // Khởi tạo giao dịch
    connection.beginTransaction((transactionError) => {
        if (transactionError) {
            console.error('Lỗi khởi tạo transaction:', transactionError);
            return res.status(500).json({ message: 'Lỗi khởi tạo giao dịch' });
        }

        // Step 1: Insert order into 'order' table
        const orderQuery = `
            INSERT INTO \`order\` (orderdate, orderstatusid, voucherCode, total, userid, name, phonenumber, address, status)
            VALUES (CURDATE(), ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const orderValues = [
            1, // orderstatusid: 1 là "chờ xác nhận"
            voucherCode || null,
            totalPayment,
            userId,
            name, // Placeholder cho full name (có thể lấy từ userContext nếu có)
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

            const orderCode = orderResults.insertId;

            // Step 2: Insert order details into 'orderdetails' table
            const orderDetailsData = cartItems.map(item => [
                orderCode,
                item.productid,
                item.size,
                item.color,
                item.quantity,
                item.brand
            ]);

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

                // Clear cart after successful order creation
                const clearCartQuery = `DELETE FROM cartitem WHERE cartid IN (SELECT cartid FROM cart WHERE userid = ? AND status = 'active')`;
                connection.query(clearCartQuery, [userId], (clearCartError) => {
                    if (clearCartError) {
                        console.error('Lỗi khi làm trống giỏ hàng:', clearCartError);
                        return connection.rollback(() => {
                            res.status(500).json({ message: 'Lỗi khi làm trống giỏ hàng' });
                        });
                    }

                    // Commit transaction nếu tất cả các query đều thành công
                    connection.commit((commitError) => {
                        if (commitError) {
                            console.error('Lỗi khi commit transaction:', commitError);
                            return connection.rollback(() => {
                                res.status(500).json({ message: 'Lỗi khi hoàn tất giao dịch' });
                            });
                        }

                        // Trả về kết quả thành công với orderCode
                        res.status(200).json({
                            success: true,
                            orderCode,
                            message: 'Đặt hàng thành công!'
                        });
                    });
                });
            });
        });
    });
});


app.post('/api/cart/clear', (req, res) => {
    const { userId } = req.body;

    // Xóa tất cả sản phẩm trong bảng cartitem của userId
    connection.query('DELETE FROM cartitem WHERE cartid IN (SELECT cartid FROM cart WHERE userid = ?)', [userId], (error, results) => {
        if (error) {
            return res.status(500).json({ message: 'Lỗi khi làm trống giỏ hàng' });
        }
        res.status(200).json({ success: true, message: 'Giỏ hàng đã được làm trống' });
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


//src/server/server.js
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
// src/server/server.js
app.get('/api/order/count/:userId', (req, res) => {
    const userId = req.params.userId;
    const query = `
        SELECT
            orderstatusid, COUNT(*) AS count
        FROM \`order\`
        WHERE userid = ?
          AND orderstatusid IN (1, 2, 3)  -- Lọc theo các trạng thái cần hiển thị
        GROUP BY orderstatusid
    `;

    connection.query(query, [userId], (error, results) => {
        if (error) {
            console.error('Lỗi khi lấy số lượng đơn hàng:', error);
            return res.status(500).json({ success: false, message: 'Lỗi khi lấy số lượng đơn hàng' });
        }

        // Khởi tạo đối tượng để chứa số lượng đơn hàng cho mỗi trạng thái
        const orderCounts = { confirm: 0, pickup: 0, deliver: 0 };
        results.forEach(row => {
            if (row.orderstatusid === 1) orderCounts.confirm = row.count;
            if (row.orderstatusid === 2) orderCounts.pickup = row.count;
            if (row.orderstatusid === 3) orderCounts.deliver = row.count;
        });

        res.status(200).json(orderCounts);
    });
});

// API để kiểm tra và áp dụng voucher
app.post('/api/voucher/apply', (req, res) => {
    const { vouchercode, totalAmount, userId } = req.body;  // Lấy mã voucher, tổng số tiền và userId từ request body

    const query = `
        SELECT vouchercode, percentdiscount, conditionvoucher, maxdiscount, startdate, enddate, status
        FROM voucher
        WHERE vouchercode = ? AND status = 1 AND startdate <= CURDATE() AND enddate >= CURDATE();
    `;

    connection.query(query, [vouchercode], (error, results) => {
        if (error) {
            console.error('Database error:', error);
            return res.status(500).json({ success: false, message: 'Có lỗi xảy ra khi kiểm tra voucher' });
        }

        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'Voucher không hợp lệ hoặc đã hết hạn' });
        }

        const voucher = results[0];

        // Kiểm tra điều kiện đơn hàng có lớn hơn giá trị điều kiện voucher không
        if (totalAmount < voucher.conditionvoucher) {
            return res.status(400).json({ success: false, message: `Giá trị đơn hàng phải lớn hơn ${voucher.conditionvoucher} để sử dụng voucher` });
        }

        // Tính toán giảm giá
        let discount = (totalAmount * voucher.percentdiscount) / 100;
        if (discount > voucher.maxdiscount) {
            discount = voucher.maxdiscount;  // Giảm giá không vượt quá maxdiscount
        }

        // Trả về thông tin voucher và số tiền giảm
        res.json({
            success: true,
            message: 'Voucher áp dụng thành công',
            discount,
            totalAfterDiscount: totalAmount - discount
        });
    });
});
//src/server/server.js
// API cập nhật approval của role
app.post('/api/role/update-approval', (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: 'UserID không hợp lệ' });
  }

  // Cập nhật giá trị approval trong bảng role
  const updateQuery = `
    UPDATE role
    SET approval = 0
    WHERE userid = ? AND approval = 1
  `;

  connection.query(updateQuery, [userId], (err, result) => {
    if (err) {
      console.error('Lỗi khi cập nhật dữ liệu:', err);
      return res.status(500).json({ message: 'Không thể cập nhật trạng thái' });
    }

    if (result.affectedRows > 0) {
      return res.status(200).json({ message: 'Đăng ký thành công. Yêu cầu của bạn đang chờ phê duyệt.' });
    } else {
      return res.status(400).json({ message: 'Lỗi cập nhật, vui lòng thử lại sau.' });
    }
  });
});


/// dưới ni là phần của shop
// API lấy sản phẩm cho cửa hàng
//src/server/server.js
app.get('/api/shop/products', (req, res) => {
    const { userId } = req.query;
    console.log('Received user ID:', userId); // Log userId nhận được

    if (!userId) {
        console.error('No user ID provided');
        return res.status(400).json({ error: 'User ID is required' });
    }

    const query = `SELECT * FROM product WHERE userid = ? AND status = 1`;
    connection.query(query, [userId], (error, results) => {
        if (error) {
//            console.error('Error fetching shop products:', error.message); // Log lỗi
            return res.status(500).json({ error: 'An error occurred while fetching products' });
        }

        // Chuyển đổi hình ảnh từ Buffer sang chuỗi Base64
        const products = results.map(row => ({
            ...row,
            image: row.image ? row.image.toString('base64') : null // Chuyển đổi Buffer thành Base64
        }));

//        console.log('Fetched products:', products); // Log sản phẩm đã lấy
        res.json(products); // Trả về danh sách sản phẩm đã được chuyển đổi
    });
});

//src/server/server.js
app.get('/api/shop/orders', (req, res) => {
    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    // Câu query để đếm số lượng đơn hàng theo các trạng thái khác nhau
    const query = `
        SELECT
            SUM(CASE WHEN o.orderstatusid = 1 THEN 1 ELSE 0 END) AS pendingConfirmation,
            SUM(CASE WHEN o.orderstatusid = 2 THEN 1 ELSE 0 END) AS pendingPickup,
            SUM(CASE WHEN o.orderstatusid = 3 THEN 1 ELSE 0 END) AS shipping,
            SUM(CASE WHEN o.orderstatusid = 4 THEN 1 ELSE 0 END) AS delivered
        FROM \`orderdetails\` od
        INNER JOIN \`product\` p ON od.productid = p.productid
        INNER JOIN \`order\` o ON od.ordercode = o.ordercode
        WHERE p.userid = ?
    `;

    connection.query(query, [userId], (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'An error occurred while fetching order stats' });
        }

        res.json(results[0]);
    });
});


// API lấy danh sách đơn hàng theo trạng thái
app.get('/api/shop/orders/status', (req, res) => {
    const { userId, orderStatusId } = req.query;

    // Kiểm tra đầu vào
    if (!userId || !orderStatusId) {
        return res.status(400).json({ error: 'Both User ID and Order Status ID are required.' });
    }

    // Kiểm tra dữ liệu đầu vào có hợp lệ không (tránh SQL Injection)
    if (isNaN(userId) || isNaN(orderStatusId)) {
        return res.status(400).json({ error: 'User ID and Order Status ID must be valid numbers.' });
    }

    // Truy vấn SQL để lấy đơn hàng theo trạng thái và người bán (client)
    const query = `
        SELECT o.ordercode, o.orderdate, o.total, o.name, o.phonenumber, o.address, o.orderstatusid
        FROM \`orderdetails\` od
        INNER JOIN \`product\` p ON od.productid = p.productid
        INNER JOIN \`order\` o ON od.ordercode = o.ordercode
        WHERE p.userid = ? AND o.orderstatusid = ?
    `;

    // Thực hiện truy vấn
    connection.query(query, [userId, orderStatusId], (error, results) => {
        if (error) {
            console.error("Error executing query:", error);  // Log lỗi nếu có
            return res.status(500).json({ error: 'An error occurred while fetching orders' });
        }
//        console.log("Orders fetched from DB:", results);  // Log kết quả từ DB
        res.json(results);  // Trả về kết quả đơn hàng

    });
});

// API cập nhật trạng thái đơn hàng
app.put('/api/shop/orders/confirm', (req, res) => {
  const { orderCode, newStatus } = req.body;

  // Kiểm tra đầu vào
  if (!orderCode || !newStatus) {
    return res.status(400).json({ error: 'Order code and new status are required.' });
  }

  // Kiểm tra dữ liệu đầu vào có hợp lệ không
  if (isNaN(orderCode) || isNaN(newStatus)) {
    return res.status(400).json({ error: 'Order code and new status must be valid numbers.' });
  }

  // Cập nhật trạng thái đơn hàng trong cơ sở dữ liệu
  const query = `
    UPDATE \`order\`
    SET orderstatusid = ?
    WHERE ordercode = ?
  `;

  connection.query(query, [newStatus, orderCode], (error, results) => {
    if (error) {
      console.error("Error updating order status:", error);
      return res.status(500).json({ error: 'An error occurred while updating order status' });
    }

    // Trả về thông báo thành công
    res.status(200).json({ message: 'Order status updated successfully' });
  });
});

///api cấu hình để thêm sản phẩm cho shop 

// src/server/server.js

const multer = require('multer');
const path = require('path');

// Cấu hình lưu trữ hình ảnh sử dụng Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Lưu hình ảnh trong thư mục 'uploads'
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Đổi tên file theo thời gian
    }
});

const upload = multer({ storage: storage });

// API để tải sản phẩm lên
app.post('/api/shop/products/upload', upload.single('image'), (req, res) => {
    const { userId, name, description, price, categoryId } = req.body;
    const image = req.file ? req.file.filename : null; // Lấy tên file hình ảnh từ Multer

    // Kiểm tra thông tin đầu vào
    if (!userId || !name || !description || !price || !categoryId) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const query = `INSERT INTO product (userid, name, description, price, categoryId, image, status) 
                    VALUES (?, ?, ?, ?, ?, ?, 1)`; // Trạng thái mặc định là 1 (hiển thị)

    // Lưu sản phẩm vào cơ sở dữ liệu
    connection.query(query, [userId, name, description, price, categoryId, image], (error, results) => {
        if (error) {
            console.error('Error uploading product:', error);
            return res.status(500).json({ error: 'An error occurred while uploading the product' });
        }

        res.status(201).json({ message: 'Product uploaded successfully', productId: results.insertId });
    });
});




// POST /api/comments/add
app.post('/api/comments/add', async (req, res) => {
    const { productid, userid, content, stars } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!productid || !userid || !content || stars === undefined) {
        return res.status(400).json({ success: false, message: 'Thông tin thiếu' });
    }

    try {
        // Thêm bình luận vào bảng 'comment'
        const query = 'INSERT INTO comment (productid, userid, content, stars, timecomment) VALUES (?, ?, ?, ?, NOW())';
        connection.query(query, [productid, userid, content, stars], (error, results) => {
            if (error) {
                console.error('Lỗi khi thêm bình luận:', error);
                return res.status(500).json({ success: false, message: 'Lỗi server' });
            }

            res.status(201).json({ success: true, message: 'Bình luận thành công' });
        });
    } catch (error) {
        console.error('Lỗi khi thêm bình luận:', error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
});


// GET /api/comments/:productid
app.get('/api/comments/:productid', async (req, res) => {
    const { productid } = req.params;

    try {
        // Lấy bình luận từ bảng 'comment' và thông tin người dùng từ bảng 'user'
        const query = `
            SELECT comment.commentid, comment.content, comment.timecomment, comment.stars, user.username 
            FROM comment 
            JOIN user ON comment.userid = user.userid 
            WHERE comment.productid = ? 
            ORDER BY comment.timecomment DESC
        `;
        connection.query(query, [productid], (error, comments) => {
            if (error) {
                console.error('Lỗi khi lấy bình luận:', error);
                return res.status(500).json({ success: false, message: 'Lỗi server' });
            }

            // Nếu không có bình luận nào, trả về danh sách trống
            if (comments.length === 0) {
                return res.json({ success: true, comments: [] });
            }

            res.json({ success: true, comments });
        });
    } catch (error) {
        console.error('Lỗi khi lấy bình luận:', error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
});


const axios = require('axios');

// API lấy tin tức từ New York Times
app.get('/api/fashion-news', async (req, res) => {
    try {
        // API key của bạn từ NYT
        const apiKey = '27N0YoLcDRkvQrNIGMzhhtjic07Lzmuh';  // Thay '123456' bằng API key thật của bạn
        
        // Định dạng URL yêu cầu với query parameter và API key
        const url = `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=fashion&api-key=${apiKey}`;
        
        // Gửi yêu cầu HTTP tới New York Times API
        const response = await axios.get(url);
        
        // Lấy dữ liệu từ response
        const articles = response.data.response.docs;

        // Tạo mảng tin tức từ dữ liệu nhận được
        const news = articles.map(article => {
            const imageUrl = article.multimedia && article.multimedia.length > 0 
                ? `https://www.nytimes.com/${article.multimedia[0].url}`  // Kết hợp URL đầy đủ
                : null;

            return {
                title: article.headline.main,  // Tiêu đề bài viết
                excerpt: article.abstract,     // Mô tả bài viết
                link: article.web_url,         // Liên kết bài viết
                imageUrl: imageUrl            // Hình ảnh với URL đầy đủ
            };
        });

        // Kiểm tra nếu không có tin tức
        if (news.length === 0) {
            return res.json({ success: true, message: 'Không có tin tức mới', news: [] });
        }

        // Trả về mảng tin tức cho client
        res.json({ success: true, news });

    } catch (error) {
        console.error('Error fetching fashion news from NYT:', error);
        res.status(500).json({ success: false, message: 'Có lỗi khi lấy tin tức từ New York Times', error: error.message });
    }
});


app.get('/api/fashion-news/detail', async (req, res) => {
    try {
        const { newsLink } = req.query;  // Lấy newsLink từ query params

        if (!newsLink) {
            return res.status(400).json({ success: false, message: 'Không có liên kết tin tức' });
        }

        const apiKey = '27N0YoLcDRkvQrNIGMzhhtjic07Lzmuh';  // API key thật của bạn
        const url = `https://api.nytimes.com/svc/search/v2/articlesearch.json?fq=web_url:("${newsLink}")&api-key=${apiKey}`;

        const response = await axios.get(url);
        const article = response.data.response.docs[0];  // Lấy bài viết đầu tiên từ kết quả tìm kiếm

        if (!article) {
            return res.status(404).json({ success: false, message: 'Bài viết không tìm thấy' });
        }

        // Lấy chi tiết bài viết
        const articleDetail = {
            title: article.headline.main,  // Tiêu đề bài viết
            content: article.lead_paragraph,  // Đoạn giới thiệu đầu tiên
            imageUrl: article.multimedia && article.multimedia.length > 0 
                ? `https://www.nytimes.com/${article.multimedia[0].url}`
                : null,  // Hình ảnh bài viết (nếu có)
            fullContent: article.full_text || article.abstract || 'Nội dung chi tiết không có sẵn',  // Nội dung đầy đủ
            date: article.pub_date,  // Ngày xuất bản
            author: article.byline ? article.byline.original : 'Tác giả không xác định'  // Tác giả (nếu có)
        };

        res.json({ success: true, article: articleDetail });
    } catch (error) {
        console.error('Error fetching fashion news detail from NYT:', error);
        res.status(500).json({ success: false, message: 'Có lỗi khi lấy chi tiết tin tức từ New York Times', error: error.message });
    }
});

// Bắt đầu lắng nghe server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});