const mysql = require('mysql2')

const connection = mysql.createConnection({
  host: '127.0.0.1',
  port: '3307',
  user: 'root',
  password: 'root',
  database: 'Youtube',
  dateStrings: true
});

module.exports = connection