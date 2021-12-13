const db = require('../../data/db-config');

function restricted(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    next({ status: 401, message: 'you shall not pass!' });
  }
}

async function checkUsernameFree(req, res, next) {
  try {
    const existing = await db('users')
      .where('username', req.body.username)
      .first();

    if (existing) {
      next({ status: 422, message: 'Username taken' });
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
}

async function checkUsernameExists(req, res, next) {
  try {
    const existing = await db('users')
      .where('username', req.body.username)
      .first();

    if (!existing) {
      next({ status: 401, message: 'Invalid credentials' });
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
}

function checkPasswordLength(req, res, next) {
  const { password } = req.body;
  if (password === undefined || !password || password.trim().length < 3) {
    next({ status: 422, message: 'Password must be longer than 3 chars' });
  } else {
    next();
  }
}

module.exports = {
  restricted,
  checkUsernameFree,
  checkUsernameExists,
  checkPasswordLength,
};
