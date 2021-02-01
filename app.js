var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

//Set public static folder
app.use(express.static(__dirname + '/public'))

// Use view engine
let expressHbs = require('express-handlebars')
let hbs = expressHbs.create({
  extname: 'hbs',
  defaultLayout: 'layout',
  layoutsDir: __dirname + '/views/layouts/',
  partialsDir: __dirname + '/views/partials'
})
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

// Define your routes here
app.get('/', (req, res) => {
  res.render('index');
})
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
