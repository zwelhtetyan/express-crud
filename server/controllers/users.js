const users = require("../dummy_data/users");
const formatDate = require("../utils/formatDate");
const createdAt = require("../utils/formatDate");
const formidable = require("formidable");
const {
  validateEmail,
  validateEmailForUpdatedUser,
} = require("../utils/validateEmail");

//get all users
function getAllUsers(req, res) {
  // const form = formidable({ multiples: true });
  // form.parse(req, (err, fields, files) => {
  //   console.log(fields, files);
  //   res.end({ message: "ok" });
  // });
  res.json(users);
}

// add new user
function addNewUser(req, res) {
  const form = formidable({ multiples: true });
  form.parse(req, (err, fields, files) => {
    console.log(err);
    console.log(fields, files);
    res.status(200).send({ message: "successfully added" });
  });

  //res.status(200).send({ message: "successfully added" });

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
    res.status(200).send({ message: "User updated successfully" });
  } else {
    res.status(400).send({ message: "Email already exit on server!" });
  }
}

// delete user
function deleteUser(req, res) {
  const userId = req.params.id;

  const idx = users.findIndex((user) => user.id === userId);

  users.splice(idx, 1);

  res.status(200).send({ message: "User deleted successfully" });
}

module.exports = { getAllUsers, addNewUser, getUser, updateUser, deleteUser };
