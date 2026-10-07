require("dotenv").config();

const mysql = require("mysql2/promise");

const useSSL =
    String(process.env.DB_SSL || "").toLowerCase() === "true";

const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "minepthe",

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000,

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

        await connection.query("SELECT 1");

        console.log("==========================================");
        console.log("MySQL connected successfully!");
        console.log("Database:", process.env.DB_NAME || "minepthe");
        console.log("Host:", process.env.DB_HOST || "localhost");
        console.log("Port:", process.env.DB_PORT || 3306);
        console.log("SSL:", useSSL);
        console.log("==========================================");

        return true;
    } catch (error) {
        console.error("==========================================");
        console.error("MYSQL CONNECTION FAILED");
        console.error("Code:", error.code || "unknown");
        console.error("Message:", error.message || "unknown");
        console.error("Errno:", error.errno || "unknown");
        console.error("SQL State:", error.sqlState || "unknown");
        console.error("Syscall:", error.syscall || "unknown");
        console.error("Host configured:", process.env.DB_HOST || "MISSING");
        console.error("Port configured:", process.env.DB_PORT || "MISSING");
        console.error("User configured:", process.env.DB_USER || "MISSING");
        console.error("Database configured:", process.env.DB_NAME || "MISSING");
        console.error("SSL configured:", useSSL);
        console.error(
            "Password configured:",
            process.env.DB_PASSWORD ? "YES" : "NO"
        );
        console.error("==========================================");

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