let express = require('express');
let router = express.Router();
let userController = require('../controllers/userController')

router.get('/login', (req, res) => {
  res.render('login');
});

router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', (req, res) => {
  let user = {
    fullname: req.body.fullname,
    username: req.body.username,
    password: req.body.password
  }
  let confirmPassword = req.body.confirmPassword;
  let keepLoggedIn = (req.body.keepLoggedIn != undefined)

  // Kiem tra confirm password va password giong nhau
  if(user.password != confirmPassword){
    return res.render('register', {
      message: 'Confirm password does not match!'
    })
  }
  // Kiem tra username chua ton tai
  userController
    .getUserByEmail(user.username)
    .then(user => {
      if (user) {
        return res.render('register', {
          message: `Email ${user.username} exists! Please choose another email address`,
          type: 'alert-danger'
        })
      }
      //tao tai khoan
      return userController
        .createUser(user)
        .then(user => {
          if(keepLoggedIn) {
            req.session.user = user;
            req.render('/');
          }else {
            res.render('login', {
              message: 'You have registered, now please login',
              type: 'alert-primary'
              
            });
          }
        });
    })
    .catch(error => next(error));
  // Tao tai khoan
})
module.exports = router;
