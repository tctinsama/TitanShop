const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

/
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


