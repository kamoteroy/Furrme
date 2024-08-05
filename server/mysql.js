const mysql = require('mysql');
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Pogiako123',
    database: 'homeowners'
});

module.exports = db;