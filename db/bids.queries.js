const pool = require('./index');

// Retrieve all bids for a specific item
const getBids = async (itemId) => {
  try {
    const result = await pool.query('SELECT * FROM bids WHERE item_id = $1', [itemId]);
    return result.rows;
  } catch (error) {
    console.error('Error fetching bids:', error);
    throw new Error('Database query error');
  }
};

// Create a new bid
const createBid = async (itemId, amount) => {
  try {
    const result = await pool.query(
      'INSERT INTO bids (item_id, amount) VALUES ($1, $2) RETURNING *',
      [itemId, amount]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error creating bid:', error);
    throw new Error('Database query error');
  }
};

// Retrieve a bid by ID
const getBidById = async (id) => {
  try {
    const result = await pool.query('SELECT * FROM bids WHERE id = $1', [id]);
    return result.rows[0];
  } catch (error) {
    console.error('Error fetching bid:', error);
    throw new Error('Database query error');
  }
};

// Update a bid
const updateBid = async (id, amount) => {
  try {
    const result = await pool.query(
      'UPDATE bids SET amount = $1 WHERE id = $2 RETURNING *',
      [amount, id]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error updating bid:', error);
    throw new Error('Database query error');
  }
};

// Delete a bid
const deleteBid = async (id) => {
  try {
    const result = await pool.query('DELETE FROM bids WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  } catch (error) {
    console.error('Error deleting bid:', error);
    throw new Error('Database query error');
  }
};

module.exports = {
  getBids,
  createBid,
  getBidById,
  updateBid,
  deleteBid,
};
