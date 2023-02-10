module.exports = function formatDate(data) {
  return new Date(data).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};
