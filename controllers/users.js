const User = require('../models/user');
// Read ALL users:
function getUsers(req, res) {
  return User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка ${err}.` }));
}
// Read ONE user:
function getUser(req, res) {
  const { userId } = req.params;
  return User.findById(userId)
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: `Пользователь по указанному id: ${userId}.` });
        return;
      }
      res.status(200).send(user);
    })
    .catch((err) => res.status(500).send({ message: `Произошла ошибка ${err}.` }));
}
// Create new user:
function createUser(req, res) {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: 'Переданы некорректные данные при создании пользователя.',
          // Variant 2 sending message error:
          // message: `${Object.values(err.errors)
          //   .map((error) => error.message)
          //   .join(', ')}`,
        });
        return;
      }
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
    .then((result) => {
      res.status(201).send(result);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(404).send({ message: `Пользователь с указанным id: ${id} не найден.` });
      }
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
    .then((result) => {
      res.status(201).send(result);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(404).send({ message: `Пользователь с указанным id: ${id} не найден.` });
      }
      res.status(500).send({ message: `Произошла ошибка ${err}.` });
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
