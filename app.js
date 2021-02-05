var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/indexRouter');
var usersRouter = require('./routes/productRouter');

var app = express();

//Set public static folder
app.use(express.static(__dirname + '/public'))

// Use view engine
let expressHbs = require('express-handlebars')
let helper = require('./controllers/helper')
let hbs = expressHbs.create({
  extname: 'hbs',
  defaultLayout: 'layout',
  layoutsDir: __dirname + '/views/layouts/',
  partialsDir: __dirname + '/views/partials',
  helpers: {
    createStarList: helper.createStarList,
    createStars: helper.createStars
  }
})
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
//Luong xu ly:
// app.js => routes/..Router.js => controllers/..Controller.js
// Lop controllers la mot lop doi tuong, cach chung ta truy xuat vao CSDL
// de thuc hien viec CRUD

//Sau nay muon thay doi database thanh mysql, mongodb thi chi can thay trong
//controllers la duoc


// Define your routes here
app.use('/', require('./routes/indexRouter'));
app.use('/products', require('./routes/productRouter'));


app.get('/sync', (req, res) => {
  let models = require('./models');
  models.sequelize.sync().then(()=>{
    res.send('datebase sync completed!');
  })
})
app.get('/:page', (req, res) => {
  let banners = {
    blog: 'Our Blog',
    category: 'Shop Category',
    cart: 'Shopping Cart',
  };
  let page = req.params.page;
  res.render(page, {banner: banners[page]});
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
