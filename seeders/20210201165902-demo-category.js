'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let data = [
    {name: "Men", imagepath: '/img/home/hero-slide1.png'},
    {name: "Women", imagepath: '/img/home/hero-slide2.png'},
    {name: "Accessories", imagepath: '/img/home/hero-slide3.png'},
    {name: "Footwear", imagepath: '/img/home/hero-slide1.png'},
    {name: "Bay item", imagepath: '/img/home/hero-slide2.png'},
    {name: "Electronics", imagepath: '/img/home/hero-slide3.png'},
    {name: "Food", imagepath: '/img/home/hero-slide1.png'},
  ];
  data.map(item => {
    item.createdAt = Sequelize.literal('NOW()');
    item.updatedAt = Sequelize.literal('NOW()');
    return item;
  })
    return await queryInterface.bulkInsert('Categories', data, {});

  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkDelete('People', null, {});
  }
};
