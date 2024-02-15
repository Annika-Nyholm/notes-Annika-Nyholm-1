const mysql = require('mysql2');

connection = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'newuser',
    password: process.env.MYSQL_PASS,
    database: 'quick_notes'
});

module.exports = connection;