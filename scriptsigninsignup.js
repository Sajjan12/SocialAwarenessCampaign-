const API_BASE_URL = 'http://localhost:3000/api';

var a = document.getElementById("loginBtn");
var b = document.getElementById("registerBtn");
var x = document.getElementById("login");
var y = document.getElementById("register");

function login() {
    x.style.left = "4px";
    y.style.right = "-520px";
    a.className += " whitebtn";
    b.className = "btn";
    x.style.opacity = 1;
    y.style.opacity = 0;
}

function register() {
    x.style.left = "-510px";
    y.style.right = "5px";
    a.className = "btn";
    b.className += " whitebtn";
    x.style.opacity = 0;
    y.style.opacity = 1;
}

// Show loading state
function showLoading(button) {
    button.disabled = true;
    button.style.opacity = '0.7';
    button.value = 'Processing...';
}

// Hide loading state
function hideLoading(button, originalText) {
    button.disabled = false;
    button.style.opacity = '1';
    button.value = originalText;
}

// Show message to user
function showMessage(message, isError = false) {
    // Create or get message element
    let messageDiv = document.getElementById('auth-message');
    if (!messageDiv) {
        messageDiv = document.createElement('div');
        messageDiv.id = 'auth-message';
        messageDiv.style.textAlign = 'center';
        messageDiv.style.padding = '10px';
        messageDiv.style.margin = '10px 0';
        messageDiv.style.borderRadius = '5px';
        document.querySelector('.form-box').appendChild(messageDiv);
    }
    
    messageDiv.textContent = message;
    messageDiv.style.backgroundColor = isError ? '#ff4444' : '#44ff44';
    messageDiv.style.color = 'white';
    messageDiv.style.display = 'block';
    
    // Hide message after 3 seconds
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 3000);
}

// Handle user registration
async function handleRegister(event) {
    event.preventDefault();
    
    const firstname = document.querySelector('#register input[placeholder="Firstname"]').value.trim();
    const lastname = document.querySelector('#register input[placeholder="Lastname"]').value.trim();
    const email = document.querySelector('#register input[placeholder="Email Address"]').value.trim();
    const password = document.querySelector('#register input[placeholder="Password"]').value.trim();
    const submitBtn = document.querySelector('#register .submit');
    
    // Validation
    if (!firstname || !lastname || !email || !password) {
        showMessage('Please fill in all fields', true);
        return;
    }
    
    if (password.length < 6) {
        showMessage('Password must be at least 6 characters long', true);
        return;
    }
    
    // Create username from email (you can modify this logic)
    const username = email;
    
    showLoading(submitBtn);
    
    try {
        const response = await fetch(`${API_BASE_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password,
                firstname: firstname,
                lastname: lastname,
                email: email
            })
        });
        
        if (response.ok) {
            showMessage('Registration successful! Please login.');
            // Clear form
            document.querySelector('#register input[placeholder="Firstname"]').value = '';
            document.querySelector('#register input[placeholder="Lastname"]').value = '';
            document.querySelector('#register input[placeholder="Email Address"]').value = '';
            document.querySelector('#register input[placeholder="Password"]').value = '';
            
            // Switch to login form after 2 seconds
            setTimeout(() => {
                login();
            }, 2000);
        } else {
            const errorText = await response.text();
            showMessage(errorText || 'Registration failed', true);
        }
    } catch (error) {
        console.error('Registration error:', error);
        showMessage('Network error. Please try again.', true);
    } finally {
        hideLoading(submitBtn, 'Register');
    }
}

// Handle user login
async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.querySelector('#login input[placeholder="Email Address"]').value.trim();
    const password = document.querySelector('#login input[placeholder="Password"]').value.trim();
    const submitBtn = document.querySelector('#login .submit');
    
    // Validation
    if (!email || !password) {
        showMessage('Please fill in all fields', true);
        return;
    }
    
    const username = email; // Using email as username
    
    showLoading(submitBtn);
    
    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            showMessage('Login successful! Redirecting...');
            
            // Store user info in localStorage (optional)
            localStorage.setItem('username', data.username);
            localStorage.setItem('isLoggedIn', 'true');
            
            // Redirect to main site after 1 second
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        } else {
            const errorText = await response.text();
            showMessage(errorText || 'Login failed', true);
        }
    } catch (error) {
        console.error('Login error:', error);
        showMessage('Network error. Please try again.', true);
    } finally {
        hideLoading(submitBtn, 'Sign in');
    }
}

// Initialize event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add event listeners to forms
    const loginForm = document.querySelector('#login');
    const registerForm = document.querySelector('#register');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    a = document.getElementById("loginbtn") || document.getElementById("loginBtn");
    b = document.getElementById("registerbtn") || document.getElementById("registerBtn");
    
    // Make sure the default view is login
    if (x && y) {
        login();
    }
});
