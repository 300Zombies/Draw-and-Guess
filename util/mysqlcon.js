// MySQL Initialization
const mysql = require("mysql");
const mysqlCon = mysql.createPool({
	connectionLimit: 10,
	host: "localhost",
	user: "root",
	password: "******",
	database: "gartic"
});
mysqlCon.connect((err) => {
	if (err) {
		throw err;
	} else {
		console.log("Database Connected!");
	}
});
module.exports = {
	core: mysql,
	con: mysqlCon
};