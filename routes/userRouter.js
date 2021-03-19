let express = require('express');
let router = express.Router();
let userController = require('../controllers/userController')


router.get('/login', (req, res) => {
  req.session.returnURL = req.query.returnURL; //moi lan vao trang login thi co the co returnURL
  res.render('login');
});

router.post('/login', (req, res, next) => {
  let email = req.body.username;
  let password = req.body.password;
  let keepLoggedIn = (req.body.keepLoggedIn != undefined); //doi tuong keepLoggedIn: ko nhan vao checkbox -> undefinded, nguoc lai -> tra ve on
  userController
    .getUserByEmail(email)
    .then(user => { //ham nay se tra ve promise
      if (user) { //neu nhu co ton tai user
        if (userController.comparePassword(password, user.password)) {
          req.session.cookie.maxAge = keepLoggedIn ? 30 * 24 * 60 * 60 * 100 : null; //luu 30 ngay, update cookie
          req.session.user = user; //login successful -> bien user moi ton tai 
          if(req.session.returnURL){
            res.redirect(req.session.returnURL);
          }
          else{
            res.redirect('/');  
          }
        } else {
          res.render('login', {
            message: 'Incorrect Password!',
            type: 'alert-danger'
          });
        }  
      } else {
        res.render('login', {
          message: 'Email does not exists!',
          type: 'alert-danger'
        });
      }
    });
});

router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', (req, res, next) => {
  let fullname = req.body.fullname;
  let email = req.body.username;
  let password = req.body.password;
  let confirmPassword = req.body.confirmPassword;
  let keepLoggedIn = (req.body.keepLoggedIn != undefined); //doi tuong keepLoggedIn: ko nhan vao checkbox -> undefinded, nguoc lai -> tra ve on

  // 1.Kiem tra confirm password va password giong nhau
  if (password != confirmPassword) {
    return res.render('register', {
      message: 'Confirm password does not match!',
      type: 'alert-danger'
    });
  }
  // 2.Kiem tra username chua ton tai
  userController
    .getUserByEmail(email)
    .then(user => {//ham nay se tra ve promise
      if (user) { //truong hop user null
        return res.render('register', {
          message: `Email ${email} exists! Please choose another email address`,
          type: 'alert-danger'
        });
      }
  // 3.(kiem tra 2 tren ok) -> tao tai khoan 
      user = {
        fullname,
        username: email,
        password
      };
      return userController
        .createUser(user)
        .then(user => {
          if (keepLoggedIn) {
            req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 100;
            req.session.user = user; //de dam bao user da login -> use bien session
            res.redirect('/');
          } else {
            res.render('login', {
              message: 'You have registered, now please login',
              type: 'alert-primary'
            });
          }
        });
    })
    .catch(error => next(error));
})

router.get('/logout', (req, res, next) => {
  req.session.destroy(error => { //khi logout -> xoa bien session
    if(error) {
      return next(error);
    }
    return res.redirect('/users/login');
  });
});
module.exports = router;
