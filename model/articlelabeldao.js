const dbConnection = require('../db/dbconnection')
const { DataTypes } = require("sequelize")

const articleLabel = dbConnection.define('articleLabel', {
    labelId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    articleId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    indexes: [{
        name: 'articleLabel_labelId',
        fields: ['labelId'],
    }, {
        name: 'articleLabel_articleId',
        fields: ['articleId']
    }]
})

articleLabel.sync()

module.exports = articleLabel