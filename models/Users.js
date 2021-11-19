const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database');

class User extends Model { }

User.init({
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'users',
    timestamps: false
})

module.exports = User;