let express = require('express');
let router = express.Router();
let userController = require('../controllers/userController');
router.post('/', userController.isLoggedIn, (req, res, next) => {
    let controller = require('../controllers/commentController')
    let comment = { //Khỏi tạo đối tượng comment có đầy đủ thông tin
        userId: 1,
        productId: req.body.productId,
        message: req.body.message
    }
    // kiemtra parentCommentId của client gửi lên có phải là số và khác rỗng hay ko
    if (!isNaN(req.body.parentCommentId) && (req.body.parentCommentId != '')){ 
        comment.parentCommentId = req.body.parentCommentId;
    }
    console.log(comment);
    controller
        .add(comment)
        .then(data => {
            res.redirect('/products/' + data.productId)
        })
        .catch(error => {
            console.log(error);
            next(error);
        });
});

// lay duoc comment ma nguoi dung gui len
// neu add duoc thanh cong thi redirect lại đường dẫn trang sản phẩm

module.exports = router;                                
