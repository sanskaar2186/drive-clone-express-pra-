const successMsg = document.getElementById("message");
if (successMsg) {
  setTimeout(() => {
    successMsg.style.display = "none";
  }, 3000); // 3000ms = 3 seconds
}

// Toggle password visibility
function togglePassword(fieldId) {
  const field = document.getElementById(fieldId);
  const type = field.getAttribute("type") === "password" ? "text" : "password";
  field.setAttribute("type", type);
}

// Form submission
document
  .getElementById("loginForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    // Client-side validation
    if (!data.email || !data.password) {
      showError("Please fill in all fields!");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      showError("Please enter a valid email address!");
      return;
    }

    const loginBtn = document.getElementById("loginBtn");
    loginBtn.textContent = "Signing In...";
    loginBtn.disabled = true;

    // Replace with your actual API endpoint
    const response = await fetch("/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
        rememberMe: data.rememberMe === "on",
      }),
    });

    const result = await response.json();

    if (response.ok) {
      showSuccess("Login successful! Redirecting...");
      // Store auth token if provided
      if (result.token) {
        // In a real app, you might store this in a secure way
        localStorage.setItem('authToken', result.token);
      }
      setTimeout(() => {
        window.location.href = `/home?msg=${encodeURIComponent(result.message)}}`;
      }, 300);
    } else {
      showError(
        result.message || "Login failed. Please check your credentials."
      );
    }
  });

// Forgot Password
function handleForgotPassword() {
  const email = document.getElementById("email").value;
  if (email) {
    showSuccess(`Password reset link has been sent to ${email}`);
    // In a real app, you would call your password reset API
    // fetch('/api/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) });
  } else {
    showError("Please enter your email address first.");
  }
}

// Auto-fill demo credentials
function fillDemoCredentials() {
  document.getElementById("email").value = "demo@clouddrive.com";
  document.getElementById("password").value = "Demo123!";
  // Trigger the floating label animation
  document.getElementById("email").dispatchEvent(new Event("input"));
  document.getElementById("password").dispatchEvent(new Event("input"));
}

// Add click handler to demo credentials
document
  .querySelector(".demo-credentials")
  .addEventListener("click", fillDemoCredentials);
document.querySelector(".demo-credentials").style.cursor = "pointer";

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

// Clear messages when user starts typing
document.getElementById("email").addEventListener("input", clearMessages);
document.getElementById("password").addEventListener("input", clearMessages);

function clearMessages() {
  document.getElementById("errorMessage").style.display = "none";
  document.getElementById("successMessage").style.display = "none";
}
