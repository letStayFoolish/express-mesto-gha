const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookies = require('cookie-parser');
const { errors } = require('celebrate');

const PORT = process.env.PORT || 3000;
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const routeUsers = require('./routes/users');
const routeCards = require('./routes/cards');
const routeLogin = require('./routes/login');
const routeCreateUser = require('./routes/signup');
const { checkAuthentication } = require('./middlewares/auth');
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
app.use(cookies());
app.use(limiter);
app.use(helmet());

// USERS:
app.use(checkAuthentication, routeUsers);
// CARDS:
app.use(checkAuthentication, routeCards);
// LOGIN:
app.use(routeLogin);
// SIGNUP:
app.use(routeCreateUser);
// Non-existent routes
app.use('/*', (req, res) => {
  res.status(404).send({ message: 'Указан некорректный путь в URL адресе' });
});
app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({ message: statusCode === 500 ? 'На сервере произошла ошибка.' : message });
});

app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});
