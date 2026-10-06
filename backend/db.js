require("dotenv").config();

const mysql = require("mysql2/promise");

const useSSL = String(process.env.DB_SSL || "").toLowerCase() === "true";

const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "minepthe",

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,

    ...(useSSL
        ? {
              ssl: {
                  minVersion: "TLSv1.2",
                  rejectUnauthorized: false
              }
          }
        : {})
});

async function testConnection() {
    let connection;

    try {
        connection = await pool.getConnection();
        console.log("MySQL connected successfully!");
        return true;
    } catch (error) {
        console.error("MySQL connection failed:", error.message);
        return false;
    } finally {
        if (connection) {
            connection.release();
        }
    }
}

module.exports = {
    pool,
    testConnection
};
