const express = require('express');
const router = express.Router();
const { getItems, getItemById, createItem, updateItem, deleteItem } = require('../models/Items');
const sendResponse = require('../utils/helperMixin');
const authenticate = require('../middleware/auth');

// Route to get all items
router.get('/items/get_all', async (req, res) => {
  try {
    const items = await getItems();
    sendResponse(res, true, 'Items fetched successfully', items);
  } catch (error) {
    console.error('Error fetching items:', error);
    sendResponse(res, false, 'Internal Server Error');
  }
});

// Route to get a single item by ID
router.get('/items/get_item/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const item = await getItemById(id);
    if (item) {
      sendResponse(res, true, 'Item fetched successfully', item);
    } else {
      sendResponse(res, false, 'Item not found', null, 404);
    }
  } catch (error) {
    console.error('Error fetching item:', error);
    sendResponse(res, false, 'Internal Server Error');
  }
});

// Route to create a new item
router.post('/items/create_new_item', authenticate, async (req, res) => {
  const { name, description, offeredPrice } = req.body;
  const ownerId = req.user.id;  // Assuming `req.user` contains the authenticated user
  if (!name || !description || !offeredPrice) {
    return sendResponse(res, false, 'Name, description, and offered price are required', null, 400);
  }

  try {
    const newItem = await createItem(name, offeredPrice, description, ownerId);
    sendResponse(res, true, 'Item created successfully', newItem, 201);
  } catch (error) {
    console.error('Error creating item:', error);
    sendResponse(res, false, 'Internal Server Error');
  }
});

// Route to update an item
router.put('/items/update_item/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  const { name, description, offeredPrice } = req.body;
  const ownerId = req.user.id;  // Assuming `req.user` contains the authenticated user

  // Check if name and description are provided
  if (!name || !description) {
    return sendResponse(res, false, 'Name and description are required', null, 400);
  }

  try {
    // Check if the item exists
    const existingItem = await getItemById(id);
    if (!existingItem) {
      return sendResponse(res, false, 'Item not found', null, 404);
    }

    // Ensure the authenticated user is the owner of the item
    if (existingItem.owner_id !== ownerId) {
      return sendResponse(res, false, 'You are not authorized to update this item', null, 403);
    }

    // Update the item
    const updatedItem = await updateItem(id, name, description, offeredPrice);
    if (updatedItem) {
      sendResponse(res, true, 'Item updated successfully', updatedItem);
    } else {
      sendResponse(res, false, 'Item not found', null, 404);
    }
  } catch (error) {
    console.error('Error updating item:', error);
    sendResponse(res, false, 'Internal Server Error');
  }
});

// Route to delete an item
router.delete('/items/delete_item/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  const ownerId = req.user.id;  // Assuming `req.user` contains the authenticated user

  try {
    // Check if the item exists
    const existingItem = await getItemById(id);
    if (!existingItem) {
      return sendResponse(res, false, 'Item not found', null, 404);
    }

    // Ensure the authenticated user is the owner of the item
    if (existingItem.owner_id !== ownerId) {
      return sendResponse(res, false, 'You are not authorized to delete this item', null, 403);
    }

    // Delete the item
    const deletedItem = await deleteItem(id);
    if (deletedItem) {
      sendResponse(res, true, 'Item deleted successfully', deletedItem);
    } else {
      sendResponse(res, false, 'Item not found', null, 404);
    }
  } catch (error) {
    console.error('Error deleting item:', error);
    sendResponse(res, false, 'Internal Server Error');
  }
});

module.exports = router;
