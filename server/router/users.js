const express = require('express');
const {
  getAllUsers,
  addNewUser,
  getUser,
  updateUser,
  deleteUser,
} = require('../controllers/users');

const router = express.Router();

router.get('/users', getAllUsers);

router.post('/users', addNewUser);

router.get('/users/:id', getUser);

router.put('/users/:id', updateUser);

router.delete('/users/:id', deleteUser);

module.exports = router;
