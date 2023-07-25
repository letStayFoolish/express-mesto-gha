const { checkToken } = require('../utils/token');
const BadRequest = require('../error_handlers/bad-request-400');

const checkAuthentication = (req, res, next) => {
  const { jwt } = req.cookies;
  if (!req.cookies) {
    return next(new BadRequest('Доступ запрещен.'));
  }
  let payload;
  try {
    payload = checkToken(jwt);
  } catch (error) {
    return next(new BadRequest('Необходима авторизация.'));
  }
  req.user = payload;
  // req.user = {
  //   _id: payload._id,
  // };
  return next();
};

module.exports = { checkAuthentication };
