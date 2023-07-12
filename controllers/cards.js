const Card = require('../models/card');

// Read ALL cards
function getCards(req, res) {
  return Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка ${err}.` }));
}

// Create card
function createCard(req, res) {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании карточки.' });
        return;
      }
      res.status(500).send({ message: `Произошла ошибка ${err}.` });
    });
}

// Delete card
function deleteCard(req, res) {
  const { cardId } = req.params;
  return Card.findByIdAndDelete(cardId)
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(404).send({ message: `Карточка с указанным id: ${cardId} не найдена.` });
      }
      res.status(500).send({ message: `Произошла ошибка ${err}.` });
    });
}

// Put likes
function likeCard(req, res) {
  const { cardId } = req.params;
  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(404).send({ message: `Карточка с указанным id: ${cardId} не найдена.` });
      }
      res.status(500).send({ message: `Произошла ошибка ${err}.` });
    });
}
// Delete likes
function dislikeCard(req, res) {
  const { cardId } = req.params;
  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(404).send({ message: `Карточка с указанным id: ${cardId} не найдена.` });
      }
      res.status(500).send({ message: `Произошла ошибка ${err}.` });
    });
}
module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,

};
