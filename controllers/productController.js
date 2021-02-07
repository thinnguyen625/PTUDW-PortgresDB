let controller = {};
let models = require('../models'); //
const product = require('../models/product');
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

controller.getAll = (query) => {
    return new Promise((resolve, reject) => {
        let options = {
            include: [{model: models.Category}],
            attributes: ['id', 'name', 'imagepath', 'price'],
            where: {} //them dieu kien where
        };
        if(query.category){ //neu ng dung truyen vao category > 0
            options.where.categoryId = query.category; //them dieu kien categoryId
        }
        Product //lay tu bang product va truyen het tat ca cac thuoc tinh
            .findAll(options)
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