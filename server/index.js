const express = require("express");
const cors = require("cors");
const userRoutes = require("./router/users");

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static("./../client/build"));
app.use(userRoutes);

app.listen(5000, () => console.log("server listening on port: 5000"));

//http://127.0.0.1:5500/node-express/practice-users/client/build/index.html
