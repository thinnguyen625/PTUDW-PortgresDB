let controller = {};
let models = require('../models') //
let Brand = models.Brand;

controller.getAll = (query) => {
    return new Promise((resolve, reject) => {
        let options = { 
            attributes: ['id', 'name', 'imagepath'],
            include: [{
                model: models.Product,
                attributes: ['id'], //de easy thi chi lay ra id cua product thoi
                where: {}
            }]
        };
        if (query.category) {
            options.include[0].where.categoryId = 
            query.category;
        }
        Brand
            .findAll(options)
            .then(data => resolve(data)) 
            .catch(error => reject(new Error(error)));
            //neu ma lay duoc data thi resolve, nguoc lai thi nem loi ra
    });
}

module.exports = controller;