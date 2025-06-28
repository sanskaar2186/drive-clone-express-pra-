// Password strength checker
function checkPasswordStrength(password) {
  let strength = 0;
  if (password.length >= 8) strength += 25;
  if (password.match(/[a-z]/)) strength += 25;
  if (password.match(/[A-Z]/)) strength += 25;
  if (password.match(/[0-9]/)) strength += 25;
  if (password.match(/[^a-zA-Z0-9]/)) strength += 25;
  return Math.min(strength, 100);
}

// Update password strength meter
document.getElementById("password").addEventListener("input", function (e) {
  const strength = checkPasswordStrength(e.target.value);
  const strengthBar = document.getElementById("strengthBar");
  strengthBar.style.width = strength + "%";
});

// Toggle password visibility
function togglePassword(fieldId) {
  const field = document.getElementById(fieldId);
  const type = field.getAttribute("type") === "password" ? "text" : "password";
  field.setAttribute("type", type);
}

// Form submission
document
  .getElementById("registerForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    

    if (data.password.length < 5) {
      showError("Password must be at least 5 characters long!");
      return;
    }

    const registerBtn = document.getElementById("registerBtn");
    registerBtn.textContent = "Creating Account...";
    registerBtn.disabled = true;

    try {
      // Replace with your actual API endpoint
      const response = await fetch("/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          UserName: data.UserName,
          email: data.email,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        showSuccess(response.message || "Registration successful!");
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 2000);
      } else {
        showError(result.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      showError("Network error. Please check your connection and try again.");
    } finally {
      registerBtn.textContent = "Create Account";
      registerBtn.disabled = false;
    }
  });

// Utility functions
function showError(message) {
  const errorDiv = document.getElementById("errorMessage");
  const successDiv = document.getElementById("successMessage");
  errorDiv.textContent = message;
  errorDiv.style.display = "block";
  successDiv.style.display = "none";
}

function showSuccess(message) {
  const errorDiv = document.getElementById("errorMessage");
  const successDiv = document.getElementById("successMessage");
  successDiv.textContent = message;
  successDiv.style.display = "block";
  errorDiv.style.display = "none";
}

// Email validation on blur
document.getElementById("email").addEventListener("blur", function (e) {
  const email = e.target.value;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email && !emailRegex.test(email)) {
    e.target.style.borderColor = "#ff4757";
  } else {
    e.target.style.borderColor = "#e1e5e9";
  }
});
