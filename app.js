const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 3000;
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const routeUsers = require('./routes/users');
const routeCards = require('./routes/cards');
// old way: mongodb://localhost:27017/mestodb
mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(limiter);
app.use(helmet);
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
// Non-existent routes
app.use('/*', (req, res) => {
  res.status(404).send({ message: 'Указан некорректный путь в URL адресе' });
});

app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});
