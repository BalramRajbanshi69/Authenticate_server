require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');

const PORT = process.env.PORT || 3000;
const DatabaseConnection = require('./DB/db');
DatabaseConnection();


// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


// routes api
app.use("/api/auth",require("./routes/Auth"));

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});