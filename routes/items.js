const express = require('express');
const router = express.Router();
const { getItems, getItemById, createItem, updateItem, deleteItem } = require('../db/items.queries');

// Route to get all items
router.get('/items/get_all', async (req, res) => {
  try {
    const items = await getItems();
    res.status(200).json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to get a single item by ID
router.get('/items/get_item/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const item = await getItemById(id);
    if (item) {
      res.status(200).json(item);
    } else {
      res.status(404).json({ error: 'Item not found' });
    }
  } catch (error) {
    console.error('Error fetching item:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to create a new item
router.post('/items/create_new_item', async (req, res) => {
  const { name, description } = req.body;
  if (!name || !description) {
    return res.status(400).json({ error: 'Name and description are required' });
  }

  try {
    const newItem = await createItem(name, description);
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to update an item
router.put('/items/update_item/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  if (!name || !description) {
    return res.status(400).json({ error: 'Name and description are required' });
  }

  try {
    const updatedItem = await updateItem(id, name, description);
    if (updatedItem) {
      res.status(200).json(updatedItem);
    } else {
      res.status(404).json({ error: 'Item not found' });
    }
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to delete an item
router.delete('/items/delete_item/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedItem = await deleteItem(id);
    if (deletedItem) {
      res.status(200).json(deletedItem);
    } else {
      res.status(404).json({ error: 'Item not found' });
    }
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
