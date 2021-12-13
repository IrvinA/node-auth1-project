const db = require('../../data/db-config');

function restricted(req, res, next) {
  if (req.session.user) {
    next()
  } else {
    next({ 
      status: 401, 
      message: 'you shall not pass!' 
    })
  }
}

async function checkUsernameFree(req, res, next) {
  try {
    const existing = await db('users')
      .where('username', req.body.username)
      .first();

    if (existing) {
      next({
        status: 422,
        message: 'Username taken'
      });
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
}

/*
  If the username in req.body does NOT exist in the database

  status 401
  {
    "message": "Invalid credentials"
  }
*/
function checkUsernameExists() {

}

/*
  If password is missing from req.body, or if it's 3 chars or shorter

  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
*/
function checkPasswordLength() {

}

// Don't forget to add these to the `exports` object so they can be required in other modules
