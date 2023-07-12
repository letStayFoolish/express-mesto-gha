const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 3000;

const routeUsers = require('./routes/users');
const routeCards = require('./routes/cards');

mongoose.connect('mongodb://localhost:27017/mestodb', {
// mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  req.user = {
    _id: '64ae1ea9187330db754baef9',
  };
  next();
});

// USERS:
app.use(routeUsers);
// CARDS:
app.use(routeCards);

app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});
