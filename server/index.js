const express = require('express');
const cors = require('cors');
const userRoutes = require('./router/users');

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static('images'));

app.use(userRoutes);

app.get('/', (req, res) => {
  res.send('<h2>HELlO</h2><a href="http://localhost:5000/users">User</a>');
});

app.listen(5000, () => console.log('server listening on port: 5000'));
