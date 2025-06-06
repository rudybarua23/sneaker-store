const sqlite3 = require('sqlite3').verbose();    // Import sqlite3 and enable verbose logging
const db = new sqlite3.Database('./sneakers.db'); // Open (or create) a DB file called sneakers.db

// Create a 'products' table if it doesn't already exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,  
      name TEXT,                              
      brand TEXT,                             
      price REAL,                             
      image TEXT                              
    )
  `);
});

// Export the database so other files (like routes) can use it
module.exports = db;