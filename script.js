// Backend API base URL - adjust this to match your server
const API_BASE_URL = 'http://localhost:3000/api';

document.addEventListener('DOMContentLoaded', () => {
  // Check if user is logged in
  checkLoginStatus();
  
  // Handle contact form
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', handleContactForm);
  }
  
  // Load news if on news page
  if (window.location.pathname.includes('news.html')) {
    loadNews();
  }
});

// Check if user is logged in and update UI accordingly
function checkLoginStatus() {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  const username = localStorage.getItem('username');
  
  const welcomeText = document.querySelector('.welcome-text');
  const logoutBtn = document.querySelector('.logout-btn');
  
  if (isLoggedIn === 'true' && username && welcomeText) {
    // Extract first part of email for display (optional)
    const displayName = username.split('@')[0];
    welcomeText.textContent = `Welcome, ${displayName}!`;
  }
  
  // Add logout functionality
  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
  }
}

// Handle logout
function handleLogout(event) {
  event.preventDefault();
  
  // Clear localStorage
  localStorage.removeItem('username');
  localStorage.removeItem('isLoggedIn');
  
  // Show message and redirect
  alert('You have been logged out successfully!');
  window.location.href = 'indexsigninsignup.html';
}

// Handle contact form submission
async function handleContactForm(e) {
  e.preventDefault();
  
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();
  const msgBox = document.getElementById('formMsg');
  const submitBtn = e.target.querySelector('button[type="submit"]');

  // Client-side validation
  if (!name || !email || !message) {
    msgBox.textContent = 'Please fill all fields.';
    msgBox.style.color = 'red';
    return;
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    msgBox.textContent = 'Please enter a valid email address.';
    msgBox.style.color = 'red';
    return;
  }

  // Show loading state
  const originalText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending...';
  msgBox.textContent = 'Sending your message...';
  msgBox.style.color = 'blue';

  try {
    const response = await fetch(`${API_BASE_URL}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        email: email,
        message: message
      })
    });

    if (response.ok) {
      msgBox.textContent = `Thank you for reaching out, ${name}! Your message has been sent successfully.`;
      msgBox.style.color = 'green';
      
      // Clear form
      document.getElementById('name').value = '';
      document.getElementById('email').value = '';
      document.getElementById('message').value = '';
    } else {
      const errorText = await response.text();
      msgBox.textContent = errorText || 'Failed to send message. Please try again.';
      msgBox.style.color = 'red';
    }
  } catch (error) {
    console.error('Contact form error:', error);
    msgBox.textContent = 'Network error. Please check your connection and try again.';
    msgBox.style.color = 'red';
  } finally {
    // Restore button state
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }
}

// Load news from backend (optional enhancement)
async function loadNews() {
  try {
    const response = await fetch(`${API_BASE_URL}/news`);
    if (response.ok) {
      const newsData = await response.json();
      displayNews(newsData);
    }
  } catch (error) {
    console.error('Failed to load news:', error);
  }
}

// Display news articles (optional enhancement)
function displayNews(newsData) {
  const mainContainer = document.querySelector('main.container');
  if (!mainContainer || newsData.length === 0) return;
  
  // Clear existing articles (except the title)
  const existingArticles = mainContainer.querySelectorAll('article');
  existingArticles.forEach(article => article.remove());
  
  // Add news articles from backend
  newsData.forEach(article => {
    const articleElement = document.createElement('article');
    articleElement.innerHTML = `
      <h2>${article.title}</h2>
      <p>${article.content}</p>
      <small style="color: #666;">Published: ${new Date(article.date).toLocaleDateString()}</small>
    `;
    articleElement.style.marginBottom = '2rem';
    articleElement.style.padding = '1rem';
    articleElement.style.border = '1px solid #ddd';
    articleElement.style.borderRadius = '5px';
    articleElement.style.backgroundColor = '#fff';
    
    mainContainer.appendChild(articleElement);
  });
}

// Optional: Check authentication for protected pages
function requireAuth() {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  if (isLoggedIn !== 'true') {
    alert('Please log in to access this page.');
    window.location.href = 'indexsigninsignup.html';
  }
}


