let controller = {};
const { query } = require('express');
let models = require('../models') //
let Category = models.Category;
let Sequelize = require('sequelize');
let Op = Sequelize.Op;

controller.getAll = (query) => {
    return new Promise((resolve, reject) => {
        let options = {
            attributes: ['id', 'name', 'imagepath', 'summary'],
            include: [{
                model: models.Product,
                where: {},
            }]
        }
        if(query && query.search != ''){
            options.include[0].where.name = {
                [Op.iLike]: `%${query.search}%`
            };     
        }
        Category
            .findAll(options)
            .then(data => resolve(data)) 
            .catch(error => reject(new Error(error)));
            //neu ma lay duoc data thi resolve, nguoc lai thi nem loi ra
    });
}

module.exports = controller;