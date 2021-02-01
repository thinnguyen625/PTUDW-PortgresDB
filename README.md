# PTUDW-PortgresDB

**Database:

- Categories (id, name, summary, imagepath)
- Brands (id, name, summary, imagepath)
- Colors (id, name, code, imagepath)
- Products (id, name, price, imagepath, thumbnailPath, CategoryId, availability, summary, description)
- Specifications (id, name, summary)
- ProductSpecifications(id, productId, specificationId, description)
- Users(id, username, password, email, phone, fullname, avatarPath, isAdmin)
- Comments (id, message, userId, ProductId, parentCommentId, createAt)
- Reviews (id, message, rating, userID, productId, createAt)