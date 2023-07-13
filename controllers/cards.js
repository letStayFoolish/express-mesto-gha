const Card = require('../models/card');
const {
  BAD_REQUEST,
  REQUEST_NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require('../error_handlers/errors-constantes');

// Read ALL cards
function getCards(req, res) {
  return Card.find({})
    .then((cards) => {
      // Status 200:
      res.send(cards);
    })
    // Status 500 - Default
    .catch(() => res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка.' }));
}

// Create card
function createCard(req, res) {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => {
      // Status 201:
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        // Status 400:
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании карточки.' });
        return;
      }
      // Status 500 - Default
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка.' });
    });
}

// Delete card
function deleteCard(req, res) {
  const { cardId } = req.params;
  return Card.findByIdAndDelete(cardId)
    .then((card) => {
      // Status 404:
      if (!card) {
        res.status(REQUEST_NOT_FOUND).send({ message: `Карточка с указанным _id: ${cardId} не найдена.` });
        return;
      }
      // Status 200:
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        // Status 400
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные для удаления карточки.' });
        return;
      }
      // Status 500 - Default
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка.' });
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
    .then((card) => {
      // Status 404:
      if (!card) {
        res.status(REQUEST_NOT_FOUND).send({ message: `Передан несуществующий _id: ${cardId} карточки` });
        return;
      }
      // Status 201:
      res.status(201).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        // Status 400:
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные для постановки лайка.' });
        return;
      }
      // Status 500 - Default
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка.' });
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
    .then((card) => {
      // Status 404:
      if (!card) {
        res.status(REQUEST_NOT_FOUND).send({ message: `Передан несуществующий _id: ${cardId} карточки` });
        return;
      }
      // Status 200:
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        // Status 400:
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные для снятии лайка.' });
        return;
      }
      // Status 500 - Default
      res.status(500).send({ message: 'Произошла ошибка.' });
    });
}
module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,

};
