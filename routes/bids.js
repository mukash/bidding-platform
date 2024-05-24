const express = require('express');
const router = express.Router();
const { getBids, createBid, getBidById, updateBid, deleteBid,checkItemOwnership } = require('../models/Bids');
const authenticate = require('../middleware/auth'); // Assuming you have this middleware
const sendResponse = require('../utils/helperMixin');

// Route to get all bids for a specific item
router.get('/bids/get_all_bids_of_an_item/:itemId', authenticate, async (req, res) => {
  const { itemId } = req.params;
  const ownerId = req.user.id;

  try {
    // Check if the authenticated user is the owner of the item
    const itemOwner = await checkItemOwnership(itemId, ownerId);
    if (!itemOwner) {
      return sendResponse(res, false, 'Unauthorized', null, 403);
    }

    // If the user is the owner, proceed to fetch bids
    const bids = await getBids(itemId);
    sendResponse(res, true, 'Bids fetched successfully', bids);
  } catch (error) {
    console.error('Error fetching bids:', error);
    sendResponse(res, false, 'Internal Server Error');
  }
});

// Route to get a single bid by ID
router.get('/bids/get_bid/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  const ownerId = req.user.id; // Assuming the authenticated user's ID is stored in req.user.id

  try {
    // Fetch the bid
    const bid = await getBidById(id);
    if (!bid) {
      return sendResponse(res, false, 'Bid not found', null, 404);
    }

    // Check if the authenticated user is the owner of the item associated with the bid
    const itemOwner = await checkItemOwnership(bid.item_id, ownerId);
    if (!itemOwner) {
      return sendResponse(res, false, 'Unauthorized', null, 403);
    }

    // If the user is the owner, proceed to return the bid
    sendResponse(res, true, 'Bid fetched successfully', bid);
  } catch (error) {
    console.error('Error fetching bid:', error);
    sendResponse(res, false, 'Internal Server Error');
  }
});

// Route to create a new bid
router.post('/bids/create_bid', authenticate, async (req, res) => {
  const { itemId, amount } = req.body;
  const bidderId = req.user.id; // Assuming the authenticate middleware sets req.user
  if (!itemId || !amount) {
    return sendResponse(res, false, 'Item ID and amount are required', null, 400);
  }

  try {
    const newBid = await createBid(itemId, amount, bidderId);
    // io.emit('bid placed', newBid);
    sendResponse(res, true, 'Bid created successfully', newBid, 201);
  } catch (error) {
    console.log(error);
    if (error.message === 'You cannot bid on your own item') {
      return sendResponse(res, false, error.message, null, 400); // Send the specific error message to the user
    }
    console.error('Error creating bid:', error);
    sendResponse(res, false, 'Internal Server Error');
  }
});


// Route to update a bid
router.put('/bids/update_bid/:id', async (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;
  if (!amount) {
    return sendResponse(res, false, 'Amount is required', null, 400);
  }

  try {
    const updatedBid = await updateBid(id, amount);
    if (updatedBid) {
      sendResponse(res, true, 'Bid updated successfully', updatedBid);
    } else {
      sendResponse(res, false, 'Bid not found', null, 404);
    }
  } catch (error) {
    console.error('Error updating bid:', error);
    sendResponse(res, false, 'Internal Server Error');
  }
});

// Route to delete a bid
router.delete('/bids/delete_bid/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedBid = await deleteBid(id);
    if (deletedBid) {
      sendResponse(res, true, 'Bid deleted successfully', deletedBid);
    } else {
      sendResponse(res, false, 'Bid not found', null, 404);
    }
  } catch (error) {
    console.error('Error deleting bid:', error);
    sendResponse(res, false, 'Internal Server Error');
  }
});

module.exports = router;
