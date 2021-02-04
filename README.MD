# PTUDW-PortgresDB

**Database:

- Categories (id, name, summary, imagepath)
- Brands (id, name, summary, imagepath)
- Colors (id, name, code, imagepath)
- Products (id, name, price, imagepath, thumbnailPath, categoryId, brandId, availability, summary, description)
- Specifications (id, name, summary)
- ProductSpecifications(id, productId, specificationId, description)
- Users(id, username, password, email, phone, fullname, avatarPath, isAdmin)
- Comments (id, message, userId, ProductId, parentCommentId, createAt)
- Reviews (id, message, rating, userID, productId, createAt)


======================

 npm install -s pg pg-hstore sequelize sequelize-cli

 npm install -g sequelize-cli

 sequelize model:generate --name Category --attributes nam
e:string,summary:text,imagepath:text

$ sequelize model:generate --name Colors --attributes name: 
string,price:decimal,imagepath:text,thumbnailPath:text,avai 
lability:boolean,summary:text,description:text

sequelize db:seed:all

=====================

mockaroo.com: Tạo dữ liệu random

=====================

"development": {
    "username": "postgres",
    "password": "123456",
    "database": "aromadb",
    "host": "127.0.0.1",
    "dialect": "postgres"
  },

======================

git add .
$ git commit -am 'add database'