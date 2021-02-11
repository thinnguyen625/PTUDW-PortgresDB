let controller = {};
const { query } = require('express');
let models = require('../models') //
let Color = models.Color;
let Sequelize = require('sequelize');
let Op = Sequelize.Op;

controller.getAll = () => {
    return new Promise((resolve, reject) => {
        let options = {
            attributes: ['id', 'name', 'imagepath', 'code'],
            include: [{
                model: models.ProductColor, 
                include: [{
                    model: models.Product,
                    attributes: [],
                    where: {
                        price:{
                            [Op.gte]: query.min,
                            [Op.lte]: query.max,
                        }
                    }
                }]
            }]
        };
        if(query.category > 0){
            options.include[0].include[0].where.categoryId = 
            query.category;
        }
        if(query.brand > 0){  //neu co brand thi chung ta se loc ra nhung brand tuong ung
            options.include[0].include[0].where.brandId = 
            query.brand; //include productColor o tren
        }
        Color
            .findAll(options)
            .then(data => resolve(data)) 
            .catch(error => reject(new Error(error)));
            //neu ma lay duoc data thi resolve, nguoc lai thi nem loi ra
    });
}

module.exports = controller;