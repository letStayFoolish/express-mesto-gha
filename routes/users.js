const router = require('express').Router();
const {
  getUsers, getUser, createUser, updateUser, updateAvatar, uncorrectedURL,
} = require('../controllers/users');

router.get('/users', getUsers); // Read ALL users
router.get('/users/:userId', getUser); // Read ONE user
router.post('/users', createUser); // Create new user
router.patch('/users/me', updateUser); // Update user's info
router.patch('/users/me/avatar', updateAvatar); // Update user's avatar
router.patch('/*', uncorrectedURL); // Uncorrected route while patching data

module.exports = router;
