const router = require('express').Router();
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');
// const { getCards, deleteCard, createCard } = require('../controllers/users');
//
router.get('/cards', getCards); // Read ALL cards
router.post('/cards', createCard); // Create new card
router.delete('/cards/:cardId', deleteCard); // Delete card
router.put('/cards/:cardId/likes', likeCard); // Update - add like on card
router.delete('/cards/:cardId/likes', dislikeCard); // Update - remove like on card
//
module.exports = router;
