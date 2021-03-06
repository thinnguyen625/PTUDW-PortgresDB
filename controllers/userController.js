let controller = {};
let models = require('../models')
let User = models.User;
let bcryptjs = require('bcryptjs')

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

module.exports = controller;