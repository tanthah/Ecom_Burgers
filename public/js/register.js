// Lấy các elements
const registrationForm = document.getElementById("registrationForm");
const registerBtn = document.getElementById("registerBtn");
const nameInput = document.getElementById("name");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const nameError = document.getElementById("nameError");
const usernameError = document.getElementById("usernameError");
const passwordError = document.getElementById("passwordError");

// Hàm validate real-time
function validateFormRealTime() {
  const name = nameInput.value.trim();
  const username = usernameInput.value.trim();
  const password = passwordInput.value;

  // Clear previous errors
  nameError.textContent = "";
  usernameError.textContent = "";
  passwordError.textContent = "";

  let isNameValid = true;
  let isEmailValid = true;
  let isPasswordValid = true;

  // Validate Full Name
  if (name === "") {
    isNameValid = false;
  } else if (!/^[a-zA-Z\s]+$/.test(name)) {
    nameError.textContent =
      "Full Name should contain only letters and spaces.";
    isNameValid = false;
  }

  // Validate Email
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (username === "") {
    isEmailValid = false;
  } else if (!emailRegex.test(username)) {
    usernameError.textContent = "Invalid email format.";
    isEmailValid = false;
  }

  // Validate Password
  const passwordRegex =
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,}$/;
  if (password === "") {
    isPasswordValid = false;
  } else if (!passwordRegex.test(password)) {
    passwordError.textContent =
      "Password must be at least 8 characters long and contain at least one digit, one lowercase letter, one uppercase letter, and one special character, with no spaces.";
    isPasswordValid = false;
  }

  // Enable/disable nút Register
  if (isNameValid && isEmailValid && isPasswordValid) {
    registerBtn.disabled = false;
    registerBtn.classList.remove("btn-secondary");
    registerBtn.classList.add("btn-warning");
  } else {
    registerBtn.disabled = true;
    registerBtn.classList.remove("btn-warning");
    registerBtn.classList.add("btn-secondary");
  }
}

// Event listeners cho real-time validation
nameInput.addEventListener("input", validateFormRealTime);
usernameInput.addEventListener("input", validateFormRealTime);
passwordInput.addEventListener("input", validateFormRealTime);

// Vẫn giữ validation khi submit để chặn nếu có lỗi
registrationForm.addEventListener("submit", function (event) {
  validateFormRealTime();

  if (registerBtn.disabled) {
    event.preventDefault();
  }
});

// Validate ngay khi trang load
document.addEventListener("DOMContentLoaded", function () {
  validateFormRealTime();
});
