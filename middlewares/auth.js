const { checkToken } = require('../utils/token');

const {
  BAD_UNAUTHORIZED,
} = require('../error_handlers/errors-constantes');

const checkAuthentication = (req, res, next) => {
  if (!req.cookies) {
    return res.status(BAD_UNAUTHORIZED).json({ message: 'Доступ запрещен.' });
  }
  let payload;
  const token = req.cookies.jwt;
  try {
    payload = checkToken(token);
  } catch (error) {
    return res.status(BAD_UNAUTHORIZED).json({ message: 'Необходима авторизация.' });
  }
  req.user = payload;
  next();
};

module.exports = { checkAuthentication };
