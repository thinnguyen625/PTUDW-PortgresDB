let controller = {};
const { query } = require('express');
let models = require('../models') //
let Color = models.Color;

controller.getAll = () => {
    return new Promise((resolve, reject) => {
        let options = {
            attributes: ['id', 'name', 'imagepath', 'code'],
            include: [{
                model: models.ProductColor, 
                include: [{
                    model: models.Product,
                    attributes: [],
                    where: {}
                }]
            }]
        };
        if(query.category){
            options.include[0].include[0].where.categoryId = query.category;
            
        }
        Color
            .findAll(options)
            .then(data => resolve(data)) 
            .catch(error => reject(new Error(error)));
            //neu ma lay duoc data thi resolve, nguoc lai thi nem loi ra
    });
}

module.exports = controller;