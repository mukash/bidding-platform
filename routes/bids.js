const express = require('express');
const router = express.Router();
const { getBids, createBid, getBidById, updateBid, deleteBid } = require('../db/bids.queries');
const io = require('../sockets').io;

// Route to get all bids for a specific item
router.get('/bids/get_all_bids_of_an_item/:itemId', async (req, res) => {
  const { itemId } = req.params;
  try {
    const bids = await getBids(itemId);
    res.status(200).json(bids);
  } catch (error) {
    console.error('Error fetching bids:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to get a single bid by ID
router.get('/bids/get_bid/:id', async (req,  res) => {
  const { id } = req.params;
  try {
    const bid = await getBidById(id);
    if (bid) {
      res.status(200).json(bid);
    } else {
      res.status(404).json({ error: 'Bid not found' });
    }
  } catch (error) {
    console.error('Error fetching bid:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to create a new bid
router.post('/bids/create_bid', async (req, res) => {
  const { itemId, amount } = req.body;
  if (!itemId || !amount) {
    return res.status(400).json({ error: 'Item ID and amount are required' });
  }

  try {
    const newBid = await createBid(itemId, amount);

    // Emit the new bid to all connected clients
    io.emit('bid placed', newBid);

    res.status(201).json(newBid);
  } catch (error) {
    console.error('Error creating bid:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to update a bid
router.put('/bids/update_bid/:id', async (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;
  if (!amount) {
    return res.status(400).json({ error: 'Amount is required' });
  }

  try {
    const updatedBid = await updateBid(id, amount);
    if (updatedBid) {
      res.status(200).json(updatedBid);
    } else {
      res.status(404).json({ error: 'Bid not found' });
    }
  } catch (error) {
    console.error('Error updating bid:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to delete a bid
router.delete('/bids/delete_bit/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedBid = await deleteBid(id);
    if (deletedBid) {
      res.status(200).json(deletedBid);
    } else {
      res.status(404).json({ error: 'Bid not found' });
    }
  } catch (error) {
    console.error('Error deleting bid:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
