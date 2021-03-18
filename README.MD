# PTUDW-PortgresDB
Technology: 
- Server site render
- admin1@gmail.com
- pass: admin
- 
## Part 1 - Building Online Shopping Web Application using NodeJS Express & Handlebars

- `npm init`: Khoi tao file package.js (*luu nhung cau hinh lien quan den project minh lam viec*)
- `npm install -s express`
- `node app`
  

**Database**:

- Categories (id, name, summary, imagepath)
- Brands (id, name, summary, imagepath)
- Colors (id, name, code, imagepath)
- Products (id, name, price, imagepath, thumbnailPath, categoryId, brandId, availability, summary, description)
- Specifications (id, name, summary)
- ProductSpecifications(id, productId, specificationId, description)
- Users(id, username, password, email, phone, fullname, avatarPath, isAdmin)
- Comments (id, message, userId, ProductId, parentCommentId, createAt)
- Reviews (id, message, rating, userID, productId, createAt)

**pgAdmin**

----

 - `npm install -s pg pg-hstore sequelize sequelize-cli` <br>
 `npm install -g sequelize-cli`

 - `sequelize model:generate --name Category --attributes name:string,summary:text,imagepath:text`

 - `sequelize model:generate --name Colors --attributes name: string,price:decimal,imagepath:text,thumbnailPath:text,avai lability:boolean,summary:text,description:text`

 - `sequelize db:seed:all`

----

mockaroo.com: Tạo dữ liệu random

----
```
"development": { 
    "username": "postgres",
    "password": "123456",
    "database": "aromadb",
    "host": "127.0.0.1",
    "dialect": "postgres"
  },
```
----

**Deploy code truc tiep len Heroku"**
- `git add .`
- `git commit -am 'add database'`
- `git push heroku master`

----

## Part 5 - Building Browse & Filter Functionalities for Online Shopping Web Application

http://localhost:3000/products?category=1&brand=1&color=1&min=0&max50

> Truyen tham so theo dang query.
> Ban chat la xu

**[URLSearchParams](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
)**

**Cau lenh truy van du lieu** 
- `Select "productId", "colorId", "id"`
- `from public productColor`
- `order by "productId", "colorId", "id"`

**Cau lenh xoa du lieu bi sai** 
- `delete from public ."ProductColors" as "P1"`
- `using public ."ProductColors" as "P2"`
- `where "P1"."id">"P2"."id"`
- `and "P1"."productId" = "P2"."productId"`
- `and "P1"."colorId" = "P1"."colorId"`

**Xu ly query truyen sai tham so:**
> http://localhost:3000/products?category=a

```
router.get('/', (req, res, next) => {
  if ((req.query.category == null) || isNaN(req.query.category)){
    req.query.category = 0;
  }
  ...
```

**Xu ly khi filter khi onClick**

```
{{#each categories}}
  <li class="filter-list"><input 
  class="pixel-radio" type="radio" 
  id="category{{dataValues.id}}" name="brand" 
  onclick="selectParam('category', {{dataValues.id}})"><label
  for="category{{dataValues.id}}" > 
  {{dataValues.name}}
  <span> ({{Products.length}}) 
  </span></label></li>
{{/each}}
```

## Part 6 - Building Searching, Sorting and Paging Functionalities for Online Shopping Web Application

**Phan trang**
`npm i -s express-handlebars-paginate`


## Part 7 - Building Shopping Cart for Online Shopping Web Application

- Gio hang luu tren express la mot vung nho tren server
- Co che cua mot session tung nguoi dung la su dung cookie
- Khi nguoi dung add mot san pham vao cart => can co bodyparser de lay tham so ma nguoi dung truyen len 
  
`npm i -s cookie-parser express-session body-parser`


## Part 8 - Building Add Comment Functionality for Online Shopping Web Application

**/model/comment.js**
```
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    static associate(models) {
      // define association here
      Comment.belongsTo(models.User, {foreignKey: 'userId'});
      Comment.belongsTo(models.Product, {foreignKey: 'productId'});
      Comment.belongsTo(models.Comment, { as: 'Parent', foreignKey:'parentCommentId'});
      Comment.hasMany(models.Comment, {as : 'SubComments', foreignKey: 'parentCommentId'})
    }
  };
  Comment.init({
    message: DataTypes.TEXT
  }
  return Comment;
};
```
- Mot product thi co nhieu comment
- Mot conment se co nhung thong tin chinh la 
  + Message
  + UserId, productId: de biet ai comment cho san pham nao
  + parentCommentId

**/controllers/commentController.js**
```
controller.add = (comment) => {
    return new Promise((resolve,reject) => {
        Comment
           .create(comment) //truyen vao comment
           .then(data => resolve(data))
           .catch(error => reject(new Error(error)))
    });
}
```
=> Ham add se nhan vao mot doi tuong comment va tra ve noi dung comment

**/routes/commentRouter.js**
```
router.post('/', (req, res, next) => {
    let controller = require('../controllers/commentController')
    let comment = { //Khỏi tạo đối tượng comment có đầy đủ thông tin
        userId: 1,
        productId: req.body.productId,
        message: req.body.message
    }
    // kiemtra parentCommentId của client gửi lên có phải là số và khác rỗng hay ko
    if (!isNaN(req.body.parentCommentId) && (req.body.parentCommentId != '')){ 
        comment.parentCommentId = req.body.parentCommentId;
    }
    console.log(comment);
    controller
        .add(comment)
        .then(data => {
            res.redirect('/products/' + data.productId)
        })
        .catch(error => {
            console.log(error);
            next(error);
        });
});
```
Thuc hien chuc nang reply comment

## Part 10 - Building Register and Login Functionalities for Online Shopping Web Application

```npm install -s bcryptjs```







