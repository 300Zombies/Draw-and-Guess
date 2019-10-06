// MySQL Initialization
const secret = require("./secret");
const mysql = require("mysql");
const pool = mysql.createPool({
	connectionLimit: 100,
	host: "localhost",
	user: "root",
	password: secret.pwd,
	database: secret.db,
	acquireTimeout: 10000,
	waitForConnections: true,
	queueLimit: 10000,
});
const sqlQuery = function (query, data) {
	return new Promise((resolve, reject) => {
		pool.query(query, data, (err, result) => {
			if (err) {
				reject(err);
			} else {
				resolve(result);
			}
		});
	});
};
module.exports = {
	core: mysql,
	con: sqlQuery
};