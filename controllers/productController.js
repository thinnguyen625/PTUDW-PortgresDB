let controller = {};
let models = require('../models'); //
const product = require('../models/product');
let Product = models.Product;
let Sequelize = require('sequelize');
let Op = Sequelize.Op; 

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

controller.getAll = (query) => {
    return new Promise((resolve, reject) => {
        let options = {
            include: [{model: models.Category}],
            attributes: ['id', 'name', 'imagepath', 'price', 'categoryId'],
            where: {
                price:{
                    [Op.gte]: query.min,
                    [Op.lte]: query.max,
                }
            } //them dieu kien where
        };
        if(query.category > 0){ //neu ng dung truyen vao category > 0
            options.where.categoryId = query.category; //them dieu kien categoryId
        }
        if(query.search != ''){
            options.where.name = { //them dieu kien name
                [Op.iLike]: `%${query.search}%` // dung template: co the chua keywork nguoi dung tim kiem
            };
        }
        if(query.brand > 0){
            options.where.brandId = query.brand;
        }
        if(query.color > 0){
            options.include.push({
                model: models.ProductColor,
                attributes: [],
                where: {colorId: query.color}
            })
        }
        if(query.limit > 0){
            options.limit = query.limit;
            options.offset = query.limit * (query.page - 1);
        }
        if(query.sort){
            switch (query.sort){
                case 'name': 
                    options.order = [
                        ['name', 'ASC']
                    ];
                    break;
                case 'price': 
                    options.order = [
                        ['price', 'ASC']
                    ];
                    break;
                case 'overallReview': 
                    options.order = [
                        ['overallReview', 'DESC']
                    ];
                    break;
                default: 
                    options.order = [
                        ['name', 'ASC']
                    ];
                    break;
                }
        }
        Product //lay tu bang product va truyen het tat ca cac thuoc tinh
            .findAndCountAll(options) //ham nay tra ve {rows, count} de vua co danh sach cac sp va vua co so sp thoa dieu kien 
            .then(data => resolve(data)) 
            .catch(error => reject(new Error(error)));
            //neu ma lay duoc data thi resolve, nguoc lai thi nem loi ra
    });
}

controller.getById = (id) => {
    return new Promise((resolve, reject) => {
        let product;
        Product
            .findOne({
                where: {id: id},
                include: [{ model: models.Category}],
            })
            .then(result => {
                product = result;
                return models.ProductSpecification.findAll({
                    where: {productId: id},
                    include: [{model: models.Specification}]
                });
            })
            .then(productSpecifications => {
                product.ProductSpecifications = productSpecifications;
                return models.Comment.findAll({
                    where: {productId: id, parentCommentId: null},
                    include:[{model: models.User},
                        {
                            model: models.Comment,
                            as: 'SubComments',
                            include: [{ model: models.User }]
                        }
                    ]
                })
                
            })
            .then(comments => {
                product.Comments = comments;
                return models.Review.findAll({
                    where: { productId: id},
                    include: [{model: models.User}]
                });
            })
            .then(reviews => {
                product.Reviews = reviews;
                let stars = [];
                for (let i=1; i<=5; i++){
                    stars.push(reviews.filter(item => (item.rating == i)).length)
                }
                product.stars = stars; //co stars roi thi gan vo cho product
                resolve(product);
            })
            .catch(error => reject(new Error(error)));
    });
}

module.exports = controller;