const router = require('express').Router();
const {
  createUser,
} = require('../controllers/users');

router.post('/signup', createUser); // Signup

module.exports = router;
