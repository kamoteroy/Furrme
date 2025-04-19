const mysql = require("mysql2");
/*const db = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "",
	database: "furrme",
	multipleStatements: true,
});*/
const db = mysql.createConnection({
	host: "ballast.proxy.rlwy.net",
	user: "root",
	password: "hsuzivmqpBMfktlDPJeCKToCSKUSwyrK",
	database: "railway",
	port: 33194,
	multipleStatements: true,
});
module.exports = db;
