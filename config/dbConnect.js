const mysql = require('mysql2');
const dbConnect = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'gachon_db'
});

dbConnect.connect();

module.exports = dbConnect; 
