const fs = require('fs');
const path = require('path');

// Create data directory if it doesn't exist
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log('Created data directory');
}

// Initialize files
const files = {
  'users.json': [],
  'contacts.json': [],
  'news.json': [
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
  ]
};

Object.entries(files).forEach(([filename, content]) => {
  const filePath = path.join(dataDir, filename);
  try {
    fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
    console.log(`✓ Created/updated ${filename}`);
  } catch (error) {
    console.error(`✗ Error creating ${filename}:`, error.message);
  }
});

console.log('Data initialization complete!');