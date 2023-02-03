const { db_config } = require('../config.json');
const mysql = require('mysql');

const conn = mysql.createConnection(db_config);
conn.connect();

module.exports = {conn};