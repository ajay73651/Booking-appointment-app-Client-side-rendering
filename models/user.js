const Sequelize = require('sequelize');
const sequelize = require('../config');

const User = sequelize.define('user', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: false,
  },
  phone: {
    type: Sequelize.DOUBLE,
    allowNull: false,
    unique: false,
  },
  call_date: {
    type: Sequelize.DATEONLY,
    allowNull: false,
    unique: false,
  },
  call_time: {
    type: Sequelize.TIME,
    allowNull: false,
    unique: false,
  }
});

module.exports = User;
