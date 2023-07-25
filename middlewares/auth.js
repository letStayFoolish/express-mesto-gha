const { checkToken } = require('../utils/token');
const RequestUnauthorized = require('../error_handlers/request-unauthorized-401');

const checkAuthentication = (req, res, next) => {
  const { authorization } = req.cookies;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new RequestUnauthorized('Необходима авторизация.'));
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = checkToken(token);
  } catch (error) {
    return next(new RequestUnauthorized('Необходима авторизация.'));
  }
  req.user = payload;
  return next();
};

module.exports = { checkAuthentication };
