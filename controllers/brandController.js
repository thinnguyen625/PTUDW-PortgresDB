let controller = {};
let models = require('../models') //
let Brand = models.Brand;
let Sequelize = require('sequelize');
let Op = Sequelize.Op;

controller.getAll = (query) => {
    return new Promise((resolve, reject) => {
        let options = { 
            attributes: ['id', 'name', 'imagepath'],
            include: [{
                model: models.Product,
                attributes: ['id'], //de easy thi chi lay ra id cua product thoi
                where: {
                    price:{
                        [Op.gte]: query.min,
                        [Op.lte]: query.max,
                    }
                }
            }]
        };
        if (query.category > 0) {
            options.include[0].where.categoryId = 
            query.category;
        }
        if (query.color > 0){ //neu co ton tai color thi filter ra cac sp co color
            options.include[0].include = [{ 
                model: models.ProductColor,
                attributes: [],
                where: {colorId: query.color}
            }]     
        }
        if(query.search != ''){
            options.include[0].where.name = {
                [Op.iLike]: `%${query.search}%`
            };
        }
        Brand
            .findAll(options)
            .then(data => resolve(data)) 
            .catch(error => reject(new Error(error)));
            //neu ma lay duoc data thi resolve, nguoc lai thi nem loi ra
    });
}

module.exports = controller;