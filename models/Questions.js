const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database');

class Questions extends Model { }

Questions.init({
    surveyid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'surveys',
            key: 'id'
        }
    },
    question: {
        type: DataTypes.STRING,
        allowNull: false
    },
    trueCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    falseCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
}, {
    sequelize,
    modelName: 'questions',
    timestamps: false
})

module.exports = Questions;