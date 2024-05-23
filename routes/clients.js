const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const sendResponse = require('../utils/helperMixin');
const { validateSignupData, validateSignInData, validateUpdatePasswordData, validateUpdateDetailsData } = require('../models/Clients/clientValidator');
const { getClientByEmail, createClient, updateClientPassword, updateClientDetails, deleteClient } = require('../models/Clients');
const authenticate = require('../middleware/auth');

router.post('/signup', async (req, res) => {
  const { name, email, password, phone, address } = req.body;
  
  try {
    // Validate signup data
    validateSignupData(req.body);

    const clientExists = await getClientByEmail(email);
    if (clientExists) {
      return sendResponse(res, false, 'Email is already registered', null, 400);
    }

    // Create client
    const newClient = await createClient({ name, email, password, phone, address });
    
    // Generate JWT token
    const token = jwt.sign({ id: newClient.id, email: newClient.email }, process.env.JWT_SECRET, { expiresIn: '1d' });

    sendResponse(res, true, 'Client registered successfully', { client: newClient, token }, 201);
  } catch (error) {
    console.error('Error signing up:', error);
    sendResponse(res, false, error.message || 'Internal Server Error');
  }
});

router.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // Validate signin data
    validateSignInData(req.body);

    const client = await getClientByEmail(email);
    if (!client) {
      return sendResponse(res, false, 'Invalid credentials', null, 401);
    }

    const passwordMatch = await bcrypt.compare(password, client.password);
    if (!passwordMatch) {
      return sendResponse(res, false, 'Invalid credentials', null, 401);
    }

    // Generate JWT token
    const token = jwt.sign({ id: client.id, email: client.email }, process.env.JWT_SECRET, { expiresIn: '1d' });

    sendResponse(res, true, 'Client authenticated successfully', { client, token });
  } catch (error) {
    console.error('Error signing in:', error);
    sendResponse(res, false, error.message || 'Internal Server Error');
  }
});

router.put('/update-password', async (req, res) => {
  const { id, currentPassword, newPassword } = req.body;
  
  try {
    // Validate update password data
    validateUpdatePasswordData(req.body);

    const client = await getClientById(id);
    if (!client) {
      return sendResponse(res, false, 'Client not found', null, 404);
    }

    const passwordMatch = await bcrypt.compare(currentPassword, client.password);
    if (!passwordMatch) {
      return sendResponse(res, false, 'Current password is incorrect', null, 400);
    }

    // Update password
    const updatedClient = await updateClientPassword(id, newPassword);

    sendResponse(res, true, 'Password updated successfully', updatedClient);
  } catch (error) {
    console.error('Error updating password:', error);
    sendResponse(res, false, error.message || 'Internal Server Error');
  }
});

router.put('/update-details', authenticate, async (req, res) => {
  const { id, name, phone, address } = req.body;
  
  try {
    // Validate update details data
    validateUpdateDetailsData(req.body);

    // Check if the authenticated user is the same as the one being updated
    if (req.user.id !== id) {
      return sendResponse(res, false, 'Unauthorized action', null, 403);
    }

    const client = await getClientById(id);
    if (!client) {
      return sendResponse(res, false, 'Client not found', null, 404);
    }

    // Update details
    const updatedClient = await updateClientDetails(id, { name, phone, address });

    sendResponse(res, true, 'Details updated successfully', updatedClient);
  } catch (error) {
    console.error('Error updating details:', error);
    sendResponse(res, false, error.message || 'Internal Server Error');
  }
});
router.delete('/delete-account/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  
  try {
    // Check if the authenticated user is the same as the one being deleted
    if (req.user.id !== id) {
      return sendResponse(res, false, 'Unauthorized action', null, 403);
    }

    // Delete account
    const deletedClient = await deleteClient(id);
    if (!deletedClient) {
      return sendResponse(res, false, 'Client not found', null, 404);
    }

    sendResponse(res, true, 'Account deleted successfully', deletedClient);
  } catch (error) {
    console.error('Error deleting account:', error);
    sendResponse(res, false, error.message || 'Internal Server Error');
  }
});

module.exports = router;
