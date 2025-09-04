// test-db.js
require("dotenv").config();
const mysql = require("mysql2");

console.log("🔍 Kiểm tra biến môi trường:");
console.log("Host:", process.env.DATABASE_HOST);
console.log("User:", process.env.DATABASE_USER);
console.log("Database:", process.env.DATABASE_NAME);
console.log(
  "Password length:",
  process.env.DATABASE_PASS
    ? process.env.DATABASE_PASS.length
    : "undefined"
);

const connection = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASS,
  database: process.env.DATABASE_NAME,
  port: process.env.DATABASE_PORT, // thêm dòng này
});

connection.connect((err) => {
  if (err) {
    console.error("❌ Lỗi kết nối:", err.message);
  } else {
    console.log("✅ Kết nối thành công!");
    connection.end();
  }
});
