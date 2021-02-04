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

module.exports = controller;