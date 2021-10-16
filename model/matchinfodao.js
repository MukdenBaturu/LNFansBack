const dbConnection = require('../db/dbconnection')
const { DataTypes } = require("sequelize")

const matchInfo = dbConnection.define('MatchInfo', {
    matchInfoId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    matchDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    homeTeam: {
        type: DataTypes.STRING,
        allowNull: false
    },
    guestTeam: {
        type: DataTypes.STRING,
        allowNull: false
    },
    videoLink: {
        type: DataTypes.STRING,
        allowNull: true
    },
    videocode: {
        type: DataTypes.STRING,
        allowNull: false
    },
    homeGoal: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    guestGoal: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    matchComment: {
        type: DataTypes.STRING,
        allowNull: true
    }
})

matchInfo.sync()

module.exports = matchInfo