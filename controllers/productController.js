let controller = {};
let models = require('../models') //
let Product = models.Product;

controller.getTrendingProducts = () => {
    return new Promise((resolve, reject) => {
        Product //lay tu bang product va truyen het tat ca cac thuoc tinh
            .findAll({
                order: [
                    ['overallReview', 'DESC']
                ],
                limit: 8,
                include: [{model: models.Category}],
                attributes: ['id', 'name', 'imagepath', 'price']
            })
            .then(data => resolve(data)) 
            .catch(error => reject(new Error(error)));
            //neu ma lay duoc data thi resolve, nguoc lai thi nem loi ra
    });
}

controller.getAll = () => {
    return new Promise((resolve, reject) => {
        Product //lay tu bang product va truyen het tat ca cac thuoc tinh
            .findAll({
                include: [{model: models.Category}],
                attributes: ['id', 'name', 'imagepath', 'price']
            })
            .then(data => resolve(data)) 
            .catch(error => reject(new Error(error)));
            //neu ma lay duoc data thi resolve, nguoc lai thi nem loi ra
    });
}

controller.getById = (id) => {
    return new Promise((resolve, reject) => {
        Product
            .findOne({
                where: {id: id},
                include: [{ model: models.Category}],
            })
            .then(result => resolve(result))
            .catch(error => reject(new Error(error)));
    });
}

module.exports = controller;