const router = require('express').Router();
const bcrypt = require('bcryptjs');
const Users = require('../users/users-model');
const {
  checkPasswordLength,
  checkUsernameExists,
  checkUsernameFree,
} = require('./auth-middleware');

router.post(
  '/register',
  checkUsernameFree,
  checkPasswordLength,
  async (req, res, next) => {
    try {
      const { username, password } = req.body;
      const hash = bcrypt.hashSync(password, 6);
      const newUser = { username, password: hash };
      const user = await Users.add(newUser);
      res.status(201).json(user);
    } catch (err) {
      next(err);
    }
  }
);

router.post('/login', checkUsernameExists, async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const [user] = await Users.findBy({ username });
    const checkedPassword = bcrypt.compareSync(password, user.password);
    if (!checkedPassword) {
      return next({ status: 401, message: 'Invalid credentials' });
    }
    req.session.user = user;
    res.status(200).json({ message: `Welcome ${user.username}!` });
  } catch (err) {
    next(err);
  }
});

router.get('/logout', async (req, res, next) => {
  if (!req.session.user) {
    return res.status(200).json({ message: 'no session' });
  }
  req.session.destroy((err) => {
    if (err) {
      return res.json({ message: 'error logging you out' });
    }
    res.status(200).json({ message: 'logged out' });
  });
});

module.exports = router;
