const pool = require('../../config/index');

// Retrieve all bids for a specific item
const getBids = async () => {
  const query = `
  SELECT 
  b.id AS bid_id,
  b.amount AS bid_amount,
  b.bidder_id AS bidder_id,
  i.id AS item_id,
  i.name AS item_name,
  i.description AS item_description,
  i.offered_price AS item_amount,
  i.owner_id AS item_owner_id,
  c.name AS bidder_name,
  c.email AS bidder_email,
  c.phone AS bidder_phone
FROM 
  bids b
INNER JOIN 
  items i ON b.item_id = i.id
INNER JOIN 
  clients c ON b.bidder_id = c.id
  `;
  const result = await pool.query(query);
  return result.rows;
};

// Create a new bid
const createBid = async (itemId, amount, bidderId) => {
  // Check if the item belongs to the bidder
  const itemResult = await pool.query('SELECT owner_id FROM items WHERE id = $1', [itemId]);
  const item = itemResult.rows[0];

  if (!item) {
    throw new Error('Item not found');
  }

  if (item.owner_id === bidderId) {
    throw new Error('You cannot bid on your own item');
  }
  const result = await pool.query(
    'INSERT INTO bids (item_id, amount, bidder_id) VALUES ($1, $2, $3) RETURNING *',
    [itemId, amount, bidderId]
  );
  return result.rows[0];
};

// Retrieve a bid by ID
const getBidById = async (id) => {
  const query = `
    SELECT 
      b.id AS bid_id,
      b.amount AS bid_amount,
      b.bidder_id AS bidder_id,
      i.id AS item_id,
      i.name AS item_name,
      i.description AS item_description,
      i.offered_price AS item_amount,
      i.owner_id AS item_owner_id,
      c.name AS bidder_name,
      c.email AS bidder_email,
      c.phone AS bidder_phone
    FROM 
      bids b
    INNER JOIN 
      items i ON b.item_id = i.id
    INNER JOIN 
      clients c ON b.bidder_id = c.id
    WHERE 
      b.id = $1
  `;
  console.log(query);
  const result = await pool.query(query, [id]);
  return result.rows[0];
};
// Update a bid
const updateBid = async (id, amount) => {
  const result = await pool.query(
    'UPDATE bids SET amount = $1 WHERE id = $2 RETURNING *',
    [amount, id]
  );
  return result.rows[0];
};

// Delete a bid
const deleteBid = async (id) => {
  const result = await pool.query('DELETE FROM bids WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};
const checkItemOwnership = async (itemId, ownerId) => {
  // Query the database to check if the authenticated user is the owner of the item
  const itemResult = await pool.query('SELECT owner_id FROM items WHERE id = $1', [itemId]);
  const item = itemResult.rows[0];
  return item && item.owner_id === ownerId;
};
module.exports = {
  getBids,
  createBid,
  getBidById,
  updateBid,
  deleteBid,
  checkItemOwnership
};
