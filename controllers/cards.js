const Card = require('../models/card');

// Read ALL cards
function getCards(req, res) {
  return Card.find({})
    .then((cards) => {
      // Status 400:

      // Status 200:
      res.status(200).send(cards);
    })
    // Status 500 - Default
    .catch((err) => res.status(500).send({ message: `Произошла ошибка ${err}.` }));
}

// Create card
function createCard(req, res) {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => {
      // Status 400:

      // Status 201:
      res.status(201).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        // Status 400:
        res.status(400).send({ message: 'Переданы некорректные данные при создании карточки.' });
        return;
      }
      // Status 500 - Default
      res.status(500).send({ message: `Произошла ошибка ${err}.` });
    });
}

// Delete card
function deleteCard(req, res) {
  const { cardId } = req.params;
  return Card.findByIdAndDelete(cardId)
    .then((card) => {
      // Status 404:
      if (!card) {
        res.status(404).send({ message: `Карточка с указанным _id: ${cardId} не найдена.` });
        return;
      }
      // Status 200:
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные для удаления карточки.' });
        return;
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
    .then((card) => {
      // Status 404:
      if (!card) {
        res.status(404).send({ message: `Передан несуществующий _id: ${cardId} карточки` });
        return;
      }
      // Status 201:
      res.status(201).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        // Status 400:
        res.status(400).send({ message: 'Переданы некорректные данные для постановки лайка.' });
        return;
      }
      // Status 500 - Default
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
    .then((card) => {
      // Status 404:
      if (!card) {
        res.status(404).send({ message: `Передан несуществующий _id: ${cardId} карточки` });
        return;
      }
      // Status 201:
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        // Status 400:
        res.status(400).send({ message: 'Переданы некорректные данные для снятии лайка.' });
        return;
      }
      // Status 500 - Default
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
