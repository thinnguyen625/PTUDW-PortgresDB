var createError = require('http-errors');
var express = require('express');
var path = require('path');
let logger = require('morgan');

var app = express();



//Set public static folder
app.use(express.static(__dirname + '/public'))

// Use view engine
let expressHbs = require('express-handlebars')
let helper = require('./controllers/helper');
const product = require('./models/product');
let paginateHelper = require('express-handlebars-paginate')
let hbs = expressHbs.create({
  extname: 'hbs',
  defaultLayout: 'layout',
  layoutsDir: __dirname + '/views/layouts/',
  partialsDir: __dirname + '/views/partials',
  helpers: {
    createStarList: helper.createStarList,
    createStars: helper.createStars,
    createPagination: paginateHelper.createPagination,
    
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


//Body parser
let bodyparser = require('body-parser')
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

//Use cookie Parser
let cookieParser = require('cookie-parser');
app.use(cookieParser());

//Use Session

let session = require('express-session');
app.use(session({
  cookie: { httpOnly: true, maxAge: 30*24*60*60*1000}, //luu toi da 30 ngay
  secret: 'S3cret',
  resave: false,
  saveUninitialized: false
}));

//Use cart controller
let Cart = require('./controllers/cartController');
app.use((req, res, next) => {
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  //Neu cart ton tai roi thi tao moi mot cart dua tren phan thong tin cart da luu truoc do
  //Nguoc lai thi khoi tao cac rong
  req.session.cart = cart; //luu cart vao memory
  res.locals.totalQuantity = cart.totalQuantity; //lay ra totalQuantity de hien thi so tren gio hang

  res.locals.username = req.session.user ? req.session.user.username: '';
  res.locals.isLoggedIn = req.session.user ? true : false;
  next();
})


// Define your routes here
app.use('/', require('./routes/indexRouter'));
app.use('/products', require('./routes/productRouter'));
app.use('/cart', require('./routes/cartRouter'))
app.use('/comments', require('./routes/commentRouter'));
app.use('/users', require('./routes/userRouter'))
app.get('/sync', (req, res) => {
  let models = require('./models');
  models.sequelize.sync().then(()=>{
    res.send('datebase sync completed!');
  })
})
app.get('/:page', (req, res) => {
  let banners = {
    blog: 'Our Blog',
    products: 'Shop Category',
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
