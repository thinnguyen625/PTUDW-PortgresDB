let controller = {};
let models = require('../models')
let User = models.User;
let bcrypt = require('bcryptjs')


controller.getUserByEmail = (email) => {//tim tai khoan email ma nguoi dung truyen vao
    return User.findOne({
        where: {
            username: email //lay ra kiem tra co phai la email hay khong
        }
    })
}

controller.createUser = (user) => {//tao tai khoan moi
    var salt = bcrypt.genSaltSync(10);
    user.password = bcrypt.hashSync(user.password, salt);// truoc khi tao thi chung ta can ma hoa mat khau
    return User.create(user);
}

controller.comparePassword = (password, hash) => {
    return bcrypt.compareSync(password, hash);
};

//middleware: Khi co bat cu 1 route nao goi len server, no phai di qua middleware isLoggedIn, 
//kiem tra neu nguoi dung co dang nhap (req.session.user co ton tai) thi se cho thu hien tiep
// con nguoc lai se redirect den trang login va luu lai dia chi url hien tai cua nguoi dung
controller.isLoggedIn = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect(`/users/login?returnURL=${req.originalUrl}`);
    }
};
module.exports = controller;