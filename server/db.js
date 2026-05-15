require('dotenv').config({ path: __dirname + '/.env' }) // read password and other settings from .env file, so no need hardcode them here
const mysql = require('mysql2/promise')

const pool = mysql.createPool({
  host:     process.env.DB_HOST,         // read from .env: MySQL server address, usually localhost
  port:     Number(process.env.DB_PORT), // read from .env: MySQL server port, usually 3306
  user:     process.env.DB_USER,         // read from .env: MySQL username, usually root
  password: process.env.DB_PASSWORD,     // read from .env: MySQL password, whatever you set for root user
  database: process.env.DB_NAME,         // read from .env: MySQL database name, should be employee_directory
  waitForConnections: true,              // read from .env: wait for available connections, don't throw errors
  connectionLimit: 10,                   // read from .env: maximum simultaneous connections
  queueLimit: 0                          // read from .env: no limit on waiting queue
})

module.exports = pool // output pool object so index.js can use it to run SQL queries