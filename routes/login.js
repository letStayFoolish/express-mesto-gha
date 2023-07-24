const router = require('express').Router();
const {
  login,
} = require('../controllers/users');

router.post('/signin', login); // Log-in

module.exports = router;
