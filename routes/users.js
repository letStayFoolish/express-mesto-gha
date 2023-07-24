const router = require('express').Router();
const {
  getUsers, getUser, getCurrentUser, updateUser, updateAvatar,
} = require('../controllers/users');

router.get('/users', getUsers); // Read ALL users
router.get('/users/me', getCurrentUser); // Read Current user
router.get('/users/:userId', getUser); // Read ONE user
router.patch('/users/me', updateUser); // Update user's info
router.patch('/users/me/avatar', updateAvatar); // Update user's avatar

module.exports = router;
