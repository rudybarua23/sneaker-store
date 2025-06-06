const cors = require('cors');
const express = require('express');         // Import Express to create the web server
const app = express();                      // Create an Express app instance
const PORT = 3001;                          // Define which port the server will run on

app.use(cors());                            // allow all origins for development
app.use(express.json());                    // Middleware: parse incoming JSON requests

// Import your product routes
const productRoutes = require('./routes/products');

// Use the product routes under the path /api/products
// So GET /api/products will call the product route handler
app.use('/api/products', productRoutes);

// Start the server and listen on the defined port
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});