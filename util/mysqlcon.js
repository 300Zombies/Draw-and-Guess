// MySQL Initialization
const mysql = require("mysql");
const pool = mysql.createPool({
	connectionLimit: 100,
	host: "localhost",
	user: "root",
	password: "a02750687138",
	database: "gartic",
	acquireTimeout: 10000,
	waitForConnections: true,
	queueLimit: 10000,
});
// pool.connect((err) => {
// 	if (err) {
// 		throw err;
// 	} else {
// 		console.log("Database Connected!");
// 	}
// });
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