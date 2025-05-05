const mysql = require("mysql2");
/*const db = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "",
	database: "furrme",
	multipleStatements: true,
});*/
const db = mysql.createConnection({
	host: "turntable.proxy.rlwy.net",
	user: "root",
	password: "HuBEgymCcyoLwfiqgcdFILWYYAFrqBlM",
	database: "railway",
	port: 17370,
	multipleStatements: true,
});

module.exports = db;
