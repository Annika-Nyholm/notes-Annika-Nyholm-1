const mysql = require('mysql2');
require('dotenv').config();

connection = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
    database: 'quick_notes'
});

module.exports = connection;