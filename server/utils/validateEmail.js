function validateEmail(users, email) {
  return users.every((user) => user.email !== email);
}

function validateEmailForUpdatedUser(users, email, id) {
  // it is invalidEmail if every email of users (except updated user) is the same with updated user email;

  return !users.some((user) => user.email === email && user.id !== id);
}

module.exports = { validateEmail, validateEmailForUpdatedUser };
