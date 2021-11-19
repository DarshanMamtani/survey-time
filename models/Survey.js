const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database');

class Survey extends Model { }

Survey.init({
    userid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    surveyName: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'survey',
    timestamps: false
})

module.exports = Survey;