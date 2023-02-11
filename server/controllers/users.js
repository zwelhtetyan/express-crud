const users = require('../dummy_data/users');
const formatDate = require('../utils/formatDate');
const createdAt = require('../utils/formatDate');
const formidable = require('formidable');
const fs = require('fs');
const {
  validateEmail,
  validateEmailForUpdatedUser,
} = require('../utils/validateEmail');
const createFilePath = require('../utils/createFile');
const createFile = require('../utils/createFile');

//get all users
function getAllUsers(req, res) {
  res.json(users);
}

// add new user
function addNewUser(req, res) {
  const form = formidable({ multiples: true });

  form.parse(req, (err, fields, files) => {
    const newUser = {
      name: fields.name,
      email: fields.email,
      password: fields.password,
      images: [],
    };

    if (!newUser.name || !newUser.email || !newUser.password) {
      return res
        .status(500)
        .json({ message: 'Please fill in all required fields.' });
    }

    if (err) {
      return res.status(500).send({ message: 'Error uploading files' });
    }

    // creating files in images folder [can configure folder path inside 'utils/createFile']
    if (Array.isArray(files.file)) {
      files.file.forEach((file) => {
        createFile(file);
      });
    } else if (files.file.originalFilename !== '') {
      createFile(files.file);
    }
  });

  //======================================

  // const isValidEmail = validateEmail(users, newUser.email);

  // const createdAt = formatDate(new Date());

  // if (isValidEmail) {
  //   users.unshift({ ...newUser, createdAt });
  //   res.status(200).send({ message: 'User added successfully' });
  // } else {
  //   res.status(400).send({ message: 'Email already exit on server!' });
  // }
}

// get single user
function getUser(req, res) {
  const userId = req.params.id;

  const user = users.find((user) => user.id === userId);

  res.status(200).send(user);
}

// update user
function updateUser(req, res) {
  const userId = req.params.id;

  const isValidEmail = validateEmailForUpdatedUser(
    users,
    req.body.email,
    req.body.id
  );

  if (isValidEmail) {
    const idx = users.findIndex((user) => user.id === userId);
    const userToUpdate = users.find((user) => user.id === userId);

    const updatedAt = formatDate(new Date());

    const updatedUser = { ...userToUpdate, ...req.body, updatedAt };

    users.splice(idx, 1, updatedUser);
    res.status(200).send({ message: 'User updated successfully' });
  } else {
    res.status(400).send({ message: 'Email already exit on server!' });
  }
}

// delete user
function deleteUser(req, res) {
  const userId = req.params.id;

  const idx = users.findIndex((user) => user.id === userId);

  users.splice(idx, 1);

  res.status(200).send({ message: 'User deleted successfully' });
}

module.exports = { getAllUsers, addNewUser, getUser, updateUser, deleteUser };
