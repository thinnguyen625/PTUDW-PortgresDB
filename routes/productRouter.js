var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', (req, res) => {
  res.render('category');
});

router.get('/:id', (req, res) => {
  res.render('cart');
});

module.exports = router;
