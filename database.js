const { Sequelize } = require('sequelize');

const sequilize = new Sequelize('survey-db', process.env.DB_USER, process.env.DB_PASSWORD, {
    dialect: 'sqlite',
    host: './survey.sqlite'
});

module.exports = sequilize;