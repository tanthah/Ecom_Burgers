const config = require("../config/app-config.js");
const mysql = require("mysql2");

class UserRepository {
  constructor() {
    this.con = mysql.createConnection(config.sqlCon);
  }

  // Save new user
  async save(user) {
    return new Promise((resolve, reject) => {
      this.con.query(
        "INSERT INTO users SET ?",
        user,
        function (err, result) {
          if (err) {
            reject(new Error(`Error saving user: ${err.message}`));
          } else {
            resolve(result);
          }
        }
      );
    });
  }

  // Get user by email
  async getUserByEmail(email) {
    return new Promise((resolve, reject) => {
      this.con.query(
        "SELECT * FROM users WHERE email = ?",
        [email],
        function (err, result) {
          if (err) {
            reject(new Error(`Database error: ${err.message}`));
          } else if (result.length < 1) {
            reject(new Error("User not found"));
          } else {
            resolve(result[0]);
          }
        }
      );
    });
  }

  // Get user by ID
  async getUserById(id) {
    return new Promise((resolve, reject) => {
      this.con.query(
        "SELECT * FROM users WHERE id = ?",
        [id],
        function (err, result) {
          if (err) {
            reject(new Error(`Database error: ${err.message}`));
          } else if (result.length < 1) {
            reject(new Error("User not found"));
          } else {
            resolve(result[0]);
          }
        }
      );
    });
  }

  // Check if user is admin
  async isAdmin(id) {
    return new Promise((resolve, reject) => {
      this.con.query(
        "SELECT user_type FROM users WHERE id = ?",
        [id],
        function (err, result) {
          if (err) {
            reject(new Error(`Database error: ${err.message}`));
          } else if (result.length < 1) {
            reject(new Error("User not found"));
          } else {
            resolve(result[0].user_type === "admin");
          }
        }
      );
    });
  }

  // Update user profile
  async update(name, email, userId) {
    return new Promise((resolve, reject) => {
      this.con.query(
        "UPDATE users SET name = ?, email = ? WHERE id = ?",
        [name, email, userId],
        function (err, result) {
          if (err) {
            reject(new Error(`Error updating user: ${err.message}`));
          } else if (result.affectedRows === 0) {
            reject(new Error("User not found"));
          } else {
            resolve("Success");
          }
        }
      );
    });
  }

  // Update password
  async updatePassword(hashedPassword, userId) {
    return new Promise((resolve, reject) => {
      this.con.query(
        "UPDATE users SET password = ? WHERE id = ?",
        [hashedPassword, userId],
        function (err, result) {
          if (err) {
            reject(
              new Error(`Error updating password: ${err.message}`)
            );
          } else if (result.affectedRows === 0) {
            reject(new Error("User not found"));
          } else {
            resolve("Success");
          }
        }
      );
    });
  }

  // Get employees
  async getEmployees() {
    return new Promise((resolve, reject) => {
      this.con.query(
        'SELECT * FROM users WHERE user_type IN ("employee", "admin")',
        function (err, result) {
          if (err) {
            reject(
              new Error(`Error getting employees: ${err.message}`)
            );
          } else {
            resolve(result);
          }
        }
      );
    });
  }

  // Update employee
  async updateEmployee(userData, id) {
    return new Promise((resolve, reject) => {
      this.con.query(
        "UPDATE users SET ? WHERE id = ?",
        [userData, id],
        function (err, result) {
          if (err) {
            reject(
              new Error(`Error updating employee: ${err.message}`)
            );
          } else if (result.affectedRows === 0) {
            reject(new Error("Employee not found"));
          } else {
            resolve("Account changes saved successfully");
          }
        }
      );
    });
  }
}

module.exports = UserRepository;
