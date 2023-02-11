const express = require('express');
const cors = require('cors');
const userRoutes = require('./router/users');

const app = express();

app.use(express.json());
app.use(cors());

app.use(userRoutes);

app.listen(5000, () => console.log('server listening on port: 5000'));
