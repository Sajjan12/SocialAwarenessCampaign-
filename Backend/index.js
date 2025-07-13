const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const USERS_FILE = path.join(__dirname, 'data', 'users.json');
const CONTACTS_FILE = path.join(__dirname, 'data', 'contacts.json');
const NEWS_FILE = path.join(__dirname, 'data', 'news.json');

// Helper: Read JSON file with better error handling
function readJSON(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`File ${filePath} does not exist, returning empty array`);
      return [];
    }
    
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // Check if file is empty or contains only whitespace
    if (!fileContent.trim()) {
      console.log(`File ${filePath} is empty, returning empty array`);
      return [];
    }
    
    return JSON.parse(fileContent);
  } catch (error) {
    console.error(`Error reading JSON file ${filePath}:`, error.message);
    console.log(`Returning empty array for ${filePath}`);
    return [];
  }
}

// Helper: Write JSON file with better error handling
function writeJSON(filePath, data) {
  try {
    // Ensure directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`Successfully wrote to ${filePath}`);
  } catch (error) {
    console.error(`Error writing JSON file ${filePath}:`, error.message);
    throw error;
  }
}

// Helper: Initialize file with default content if it doesn't exist or is corrupted
function ensureFile(filePath, defaultContent) {
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    if (!fs.existsSync(filePath)) {
      console.log(`Creating new file: ${filePath}`);
      writeJSON(filePath, defaultContent);
      return;
    }
    
    // Check if existing file is valid
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      if (!content.trim()) {
        console.log(`File ${filePath} is empty, initializing with default content`);
        writeJSON(filePath, defaultContent);
        return;
      }
      
      JSON.parse(content);
      console.log(`File ${filePath} is valid`);
    } catch (parseError) {
      console.log(`File ${filePath} is corrupted, reinitializing with default content`);
      writeJSON(filePath, defaultContent);
    }
  } catch (error) {
    console.error(`Error ensuring file ${filePath}:`, error.message);
  }
}

// --- Routes --- //

// User registration
app.post('/api/register', (req, res) => {
  try {
    console.log('Registration request received:', req.body);
    
    const { username, password, firstname, lastname, email } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Missing credentials' });
    }

    const users = readJSON(USERS_FILE);
    
    // Check if user already exists
    if (users.find(u => u.username === username)) {
      return res.status(409).json({ error: 'Username already exists' });
    }
    
    // Add new user
    const newUser = {
      id: Date.now(), // Simple ID generation
      username,
      password,
      firstname: firstname || '',
      lastname: lastname || '',
      email: email || username,
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    writeJSON(USERS_FILE, users);
    
    console.log('User registered successfully:', username);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User login
app.post('/api/login', (req, res) => {
  try {
    console.log('Login request received:', req.body);
    
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Missing credentials' });
    }
    
    const users = readJSON(USERS_FILE);
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
      console.log('Login successful for:', username);
      res.json({ 
        message: 'Login successful', 
        username,
        user: {
          id: user.id,
          username: user.username,
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email
        }
      });
    } else {
      console.log('Login failed for:', username);
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Contact form submission
app.post('/api/contact', (req, res) => {
  try {
    console.log('Contact form submission received:', req.body);
    
    const { name, email, message } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields required' });
    }

    const contacts = readJSON(CONTACTS_FILE);
    
    const newContact = {
      id: Date.now(),
      name,
      email,
      message,
      date: new Date().toISOString()
    };
    
    contacts.push(newContact);
    writeJSON(CONTACTS_FILE, contacts);
    
    console.log('Contact message saved successfully');
    res.status(201).json({ message: 'Message received successfully' });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get news/articles
app.get('/api/news', (req, res) => {
  try {
    const news = readJSON(NEWS_FILE);
    res.json(news);
  } catch (error) {
    console.error('News fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// --- Initialize data files --- //
console.log('Initializing data files...');

ensureFile(USERS_FILE, []);
ensureFile(CONTACTS_FILE, []);
ensureFile(NEWS_FILE, [
  {
    id: 1,
    title: "Community Clean-Up Drive",
    content: "Volunteers gathered to clean local parks and promote environmental awareness.",
    date: "2025-06-08"
  },
  {
    id: 2,
    title: "Youth Mental Health Seminar",
    content: "Experts discussed the importance of mental well-being for teenagers and young adults.",
    date: "2025-06-05"
  }
]);

// --- Start server --- //
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('- POST /api/register');
  console.log('- POST /api/login');
  console.log('- POST /api/contact');
  console.log('- GET /api/news');
  console.log('- GET /api/health');
});