const dbConnection = require('../db/dbconnection')
const { DataTypes } = require("sequelize")

const Article = dbConnection.define('article', {
    articleId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    articleText: {
        type: DataTypes.TEXT('medium'),
        allowNull: false
    },
    author: {
        type: DataTypes.STRING,
        allowNull: false
    },
    createTime: {
        type: DataTypes.TIME,
        allowNull: false
    }
}, {
    charset: 'utf8'
})

Article.sync()

module.exports = Article