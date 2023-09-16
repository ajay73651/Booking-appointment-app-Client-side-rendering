const Sequelize = require("sequelize");

const sequelize = new Sequelize("user_data", "root", "Aj***", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
