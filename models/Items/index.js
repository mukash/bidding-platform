const pool = require('../../config/index');

// Retrieve all items
const getItems = async () => {
  try {
    const result = await pool.query('SELECT * FROM items');
    return result.rows;
  } catch (error) {
    console.error('Error fetching items:', error);
    throw new Error('Database query error');
  }
};

// Retrieve an item by ID
const getItemById = async (id) => {
  try {
    const result = await pool.query('SELECT * FROM items WHERE id = $1', [id]);
    return result.rows[0];
  } catch (error) {
    console.error('Error fetching item:', error);
    throw new Error('Database query error');
  }
};

// Create a new item
const createItem = async (name, offeredPrice, description, ownerId) => {
  try {
    const result = await pool.query(
      'INSERT INTO items (name, offered_price, description, owner_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, offeredPrice, description, ownerId]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error creating item:', error);
    throw new Error('Database query error');
  }
};

// Update an item
const updateItem = async (id, name, description, offeredPrice) => {
  try {
    const result = await pool.query(
      'UPDATE items SET name = $1, description = $2, offered_price = $3 WHERE id = $4 RETURNING *',
      [name, description, offeredPrice, id]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error updating item:', error);
    throw new Error('Database query error');
  }
};

// Delete an item
const deleteItem = async (id) => {
  try {
    const result = await pool.query('DELETE FROM items WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  } catch (error) {
    console.error('Error deleting item:', error);
    throw new Error('Database query error');
  }
};

module.exports = {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
};
