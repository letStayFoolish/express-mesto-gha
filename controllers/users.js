const User = require('../models/user');
// Read ALL users:
function getUsers(req, res) {
  return User.find({})
    // Status 200:
    .then((users) => res.status(200).send(users))
    // Status 500 - Default
    .catch((err) => res.status(500).send({ message: `Произошла ошибка ${err}.` }));
}
// Read ONE user:
function getUser(req, res) {
  const { userId } = req.params;
  return User.findById(userId)
    .then((user) => {
      if (!user) {
        // Status 404:
        res.status(404).send({ message: `Пользователь по указанному id: ${userId} не найден..` });
        return;
      }
      // Status 200:
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        // Status 400:
        res.status(400).send({ message: 'Указан некорректный id.' });
        return;
      }
      // Status 500 - Default:
      res.status(500).send({ message: `Произошла ошибка ${err}.` });
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
        res.status(400).send({
          message: 'Переданы некорректные данные при создании пользователя.',
        });
        return;
      }
      // Status 500 - Default
      res.status(500).send({ message: `Произошла ошибка ${err}.` });
    });
}
// Update user's info:
function updateUser(req, res) {
  const uData = {
    name: req.body.name,
    about: req.body.about,
  };
  const id = req.user._id;
  return User.findByIdAndUpdate(id, uData, { new: true })
    .then((user) => {
      // Status 400:
      if (!user || (uData.name && (uData.name.length < 2 || uData.name.length > 30))) {
        res.status(400)
          .send({ message: 'Переданы некорректные данные при обновлении профиля. ' });
        return;
      }
      if (!user || (uData.about && (uData.about.length < 2 || uData.about.length > 30))) {
        res.status(400)
          .send({ message: 'Переданы некорректные данные при обновлении профиля. ' });
        return;
      }
      // Status 200:
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        // Status 404
        res.status(404).send({ message: `Пользователь с указанным id: ${id} не найден.` });
      }
      // Status 500 - Default:
      res.status(500).send({ message: `Произошла ошибка ${err}.` });
    });
}
// Update user's avatar:
function updateAvatar(req, res) {
  const uData = {
    avatar: req.body.avatar,
  };
  const id = req.user._id;
  return User.findByIdAndUpdate(id, uData, { new: true })
    .then((user) => {
      // Status 400:
      if (!user || !uData.avatar || uData.avatar === '') {
        res.status(400)
          .send({ message: 'Переданы некорректные данные при обновлении профиля. ' });
        return;
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(404).send({ message: `Пользователь с указанным id: ${id} не найден.` });
      }
      res.status(500).send({ message: `Произошла ошибка ${err}.` });
    });
}

function uncorrectedURL(req, res) {
  // Uncorrected route while patching data
  res.status(404).send({ message: 'Указан некорректный путь в URL адресе' });
}
// Export
module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
  uncorrectedURL,
};
