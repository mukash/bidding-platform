const pool = require('../../config/index');
const bcrypt = require('bcrypt');

const getClientByEmail = async (email) => {
  const result = await pool.query('SELECT * FROM clients WHERE email = $1', [email]);
  return result.rows[0];
};

const createClient = async (clientData) => {
  const { name, email, password, phone, address } = clientData;
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await pool.query(
    'INSERT INTO clients (name, email, password, phone, address) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [name, email, hashedPassword, phone, address]
  );
  return result.rows[0];
};

const updateClientPassword = async (id, newPassword) => {
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  const result = await pool.query(
    'UPDATE clients SET password = $1 WHERE id = $2 RETURNING *',
    [hashedPassword, id]
  );
  return result.rows[0];
};

const updateClientDetails = async (id, clientData) => {
  const { name, phone, address } = clientData;
  const result = await pool.query(
    'UPDATE clients SET name = $1, phone = $2, address = $3 WHERE id = $4 RETURNING *',
    [name, phone, address, id]
  );
  return result.rows[0];
};

const deleteClient = async (id) => {
  const result = await pool.query('DELETE FROM clients WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};

module.exports = {
  getClientByEmail,
  createClient,
  updateClientPassword,
  updateClientDetails,
  deleteClient,
};
