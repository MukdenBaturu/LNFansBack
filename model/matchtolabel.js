const dbConnection = require('../db/dbconnection')
const { DataTypes } = require('sequelize')

const matchtolabel = dbConnection.define('MatchToLabel', {
    matchInfoId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    matchLabelId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    indexes: [{
        name: 'MatchToLabel_MatchId',
        fields: ['matchInfoId']
    }, {
        name: 'MatchToLabel_MatchLabelId',
        fields: ['matchLabelId']
    }]
})

matchtolabel.sync()
module.exports = matchtolabel