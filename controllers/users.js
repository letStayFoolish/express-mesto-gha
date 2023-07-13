const User = require('../models/user');
const {
  BAD_REQUEST,
  REQUEST_NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require('../error_handlers/errors-constantes');

// Read ALL users:
function getUsers(req, res) {
  return User.find({})
    // Status 200:
    .then((users) => res.send(users))
    // Status 500 - Default
    .catch(() => res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка.' }));
}
// Read ONE user:
function getUser(req, res) {
  const { userId } = req.params;
  return User.findById(userId)
    .then((user) => {
      if (!user) {
        // Status 404:
        res.status(REQUEST_NOT_FOUND).send({ message: `Пользователь по указанному id: ${userId} не найден..` });
        return;
      }
      // Status 200:
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        // Status 400:
        res.status(BAD_REQUEST).send({ message: 'Указан некорректный id.' });
        return;
      }
      // Status 500 - Default:
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка.' });
    });
}
// Create new user:
function createUser(req, res) {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    // Status 201:
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        // Status 400:
        res.status(BAD_REQUEST).send({
          message: 'Переданы некорректные данные при создании пользователя.',
        });
        return;
      }
      // Status 500 - Default
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка.' });
    });
}
// Update user's info:
function updateUser(req, res) {
  const uData = {
    name: req.body.name,
    about: req.body.about,
  };
  const id = req.user._id;
  return User.findByIdAndUpdate(id, uData, { new: true, runValidators: true })
    .then((user) => {
      // Status 404
      if (!user) {
        res.status(REQUEST_NOT_FOUND).send({ message: `Пользователь с указанным id: ${id} не найден.` });
        return;
      }
      // Status 200:
      res.send(user);
    })
    .catch((err) => {
      // Status 400:
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST)
          .send({ message: 'Переданы некорректные данные при обновлении профиля.' });
        return;
      }
      // Status 500 - Default:
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка.' });
    });
}
// Update user's avatar:
function updateAvatar(req, res) {
  const uData = {
    avatar: req.body.avatar,
  };
  const id = req.user._id;
  return User.findByIdAndUpdate(id, uData, { new: true, runValidators: true })
    .then((user) => {
      // Status 404
      if (!user) {
        res.status(REQUEST_NOT_FOUND).send({ message: `Пользователь с указанным id: ${id} не найден.` });
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      // Status 400:
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST)
          .send({ message: 'Переданы некорректные данные при обновлении профиля.' });
        return;
      }
      // Status 500 - Default:
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка.' });
    });
}

// Export
module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
};
