const dbConnection = require('../db/dbconnection');

const { DataTypes } = require("sequelize")

const User = dbConnection.define('user', {
    username: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    power: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
    userstatus: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    }
})
User.sync();

module.exports = User