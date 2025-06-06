const express = require('express');
const router = express.Router();    // Create a new router object from Express
const db = require('../db');        // Import the database connection

// ------------------------
// GET /api/products
// Returns all sneaker products in the database
// ------------------------
router.get('/', (req, res) => {
  // Query all rows from the 'products' table
  db.all('SELECT * FROM products', [], (err, rows) => {
    if (err) {
      // If there’s a DB error, return a 500 status code with the error
      return res.status(500).json({ error: err.message });
    }
    // Return the list of products as JSON
    res.json(rows);
  });
});

// ------------------------
// POST /api/products
// Adds a new product to the database
// ------------------------
router.post('/', (req, res) => {
  const { name, brand, price, image } = req.body; // Extract data from the request body

  // Run an INSERT query to add the product into the DB
  db.run(
    'INSERT INTO products (name, brand, price, image) VALUES (?, ?, ?, ?)',
    [name, brand, price, image],                  // Values to insert (prevents SQL injection)
    function (err) {
      if (err) {
        // Handle DB insert errors
        return res.status(500).json({ error: err.message });
      }

      // Return the new product info, including its new auto-generated ID
      res.status(201).json({
        id: this.lastID,
        name,
        brand,
        price,
        image,
      });
    }
  );
});

// ------------------------
// PUT /api/products/:id
// Updates an existing sneaker product by ID
// ------------------------
router.put('/:id', (req, res) => {
  const { id } = req.params; // Get the ID from the URL path
  const { name, brand, price, image } = req.body; // Extract updated data

  // Run an UPDATE query to modify the product with the given ID
  db.run(
    'UPDATE products SET name = ?, brand = ?, price = ?, image = ? WHERE id = ?',
    [name, brand, price, image, id], // Values to update
    function (err) {
      if (err) {
        // Return server error if update fails
        return res.status(500).json({ error: err.message });
      }
      if (this.changes === 0) {
        // No rows were updated — product ID not found
        return res.status(404).json({ error: 'Product not found' });
      }
      // Return success message
      res.json({ message: 'Product updated', id });
    }
  );
});

// ------------------------
// DELETE /api/products/:id
// Deletes a sneaker product by ID
// ------------------------
router.delete('/:id', (req, res) => {
  const { id } = req.params; // Get the ID from the URL path

  // Run a DELETE query to remove the product with the given ID
  db.run(
    'DELETE FROM products WHERE id = ?',
    id,
    function (err) {
      if (err) {
        // Return server error if deletion fails
        return res.status(500).json({ error: err.message });
      }
      if (this.changes === 0) {
        // No rows were deleted — product ID not found
        return res.status(404).json({ error: 'Product not found' });
      }
      // Return success message
      res.json({ message: 'Product deleted', id });
    }
  );
});

// Export this router so index.js can use it
module.exports = router;