const config = require("../config/app-config.js");
const mysql = require("mysql2");
const jwt = require("jsonwebtoken");

const controller = class UsersController {
  constructor() {
    this.con = mysql.createConnection(config.sqlCon);
  }

  // Tạo access token
  generateAccessToken(user) {
    return jwt.sign(
      { id: user.id, email: user.email, user_type: user.user_type },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
  }

  // Tạo refresh token
  generateRefreshToken(user) {
    return jwt.sign(
      { id: user.id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );
  }

  // Lưu refresh token vào database
  saveRefreshToken(userId, refreshToken) {
    return new Promise((resolve, reject) => {
      const expiresAt = new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
      ); // 7 days
      this.con.query(
        "INSERT INTO user_tokens (user_id, token, expires_at) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE token = ?, expires_at = ?",
        [userId, refreshToken, expiresAt, refreshToken, expiresAt],
        function (err, result) {
          if (err) reject(new Error("Database connection error"));
          resolve();
        }
      );
    });
  }

  // Xóa refresh token
  deleteRefreshToken(token) {
    return new Promise((resolve, reject) => {
      this.con.query(
        "DELETE FROM user_tokens WHERE token = ?",
        [token],
        function (err, result) {
          if (err) reject(new Error("Database connection error"));
          resolve();
        }
      );
    });
  }

  // Lấy user bằng refresh token
  getUserByRefreshToken(token) {
    return new Promise((resolve, reject) => {
      this.con.query(
        "SELECT u.* FROM users u JOIN user_tokens ut ON u.id = ut.user_id WHERE ut.token = ? AND ut.expires_at > NOW()",
        [token],
        function (err, result) {
          if (err) reject(new Error("Database connection error"));
          if (result.length === 0) {
            reject(new Error("Invalid refresh token"));
          } else {
            resolve(result[0]);
          }
        }
      );
    });
  }

  getUserByEmail(email) {
    return new Promise((resolve, reject) => {
      this.con.query(
        "SELECT * FROM `users` WHERE `email` = ?",
        [email],
        function (err, result) {
          if (result.length < 1) {
            reject(new Error("User not found"));
          } else {
            resolve(result[0]);
          }
        }
      );
    });
  }

  getUserById(id) {
    return new Promise((resolve, reject) => {
      this.con.query(
        "SELECT * FROM `users` WHERE `id` = ?",
        [id],
        function (err, result) {
          if (err) reject(new Error("Database connection error"));
          if (result.length < 1) {
            reject(new Error("No user with that id"));
          } else {
            resolve(result[0]);
          }
        }
      );
    });
  }

  save(user) {
    return new Promise((resolve, reject) => {
      this.con.query(
        "INSERT INTO users SET ?",
        user,
        function (err, result) {
          if (err) reject(new Error("Database connection error"));
          resolve(result.insertId);
        }
      );
    });
  }

  isAdmin(id) {
    return new Promise((resolve, reject) => {
      this.con.query(
        'SELECT * FROM `users` WHERE `id` = "' + id + '"',
        function (err, result) {
          if (result == undefined) {
            reject(new Error("User not found"));
          } else {
            if (result[0].user_type) resolve(result[0].user_type);
            reject();
          }
        }
      );
    });
  }

  // isAdmin(id) {
  //   return new Promise((resolve, reject) => {
  //     this.con.query(
  //       'SELECT * FROM `users` WHERE `id` = "' + id + '"', //  SQL Injection
  //       function (err, result) {
  //         if (result == undefined) {
  //           reject(new Error("User not found"));
  //         } else {
  //           if (result[0].user_type) resolve(result[0].user_type); //  Resolve với user_type
  //           reject(); //  LUÔN được gọi sau resolve()
  //         }
  //       }
  //     );
  //   });
  // }

  getEmployees() {
    return new Promise((resolve, reject) => {
      this.con.query(
        'SELECT * FROM `users` WHERE `user_type` != "customer"',
        function (err, result) {
          if (err) reject(new Error("Database connection error"));
          resolve(result);
        }
      );
    });
  }

  updateEmployee(user, id) {
    return new Promise((resolve, reject) => {
      this.con.query(
        "UPDATE `users` SET ? WHERE `id` = ?",
        [user, id],
        function (err, result) {
          if (err) reject(err);
          resolve("User updated successfully!");
        }
      );
    });
  }

  update(name, email, id) {
    return new Promise((resolve, reject) => {
      this.con.query(
        "UPDATE `users` SET name = ?, email = ? WHERE `id` = ?",
        [name, email, id],
        function (err, result) {
          if (err) reject(err);
          resolve("User updated successfully!");
        }
      );
    });
  }

  updatePassword(password, id) {
    return new Promise((resolve, reject) => {
      this.con.query(
        "UPDATE `users` SET password = ? WHERE `id` = ?",
        [password, id],
        function (err, result) {
          if (err) reject(err);
          resolve("Password updated successfully!");
        }
      );
    });
  }
};

module.exports = controller;
