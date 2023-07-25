const { checkToken } = require('../utils/token');
const RequestUnauthorized = require('../error_handlers/request-unauthorized-401');

const checkAuthentication = (req, res, next) => {
  const { jwt } = req.cookies;

  if (!jwt || !jwt.startsWith('Bearer ')) {
    return next(new RequestUnauthorized('Необходима авторизация.'));
  }
  // const token = jwt.replace('Bearer ', '');
  let payload;
  try {
    payload = checkToken(jwt);
  } catch (error) {
    return next(new RequestUnauthorized('Необходима авторизация.'));
  }
  req.user = payload;
  return next();
};

module.exports = checkAuthentication;
