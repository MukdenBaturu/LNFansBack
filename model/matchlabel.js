const dbConnection = require('../db/dbconnection')
const { DataTypes } = require("sequelize")

const matchLabel = dbConnection.define('MatchLabel', {
    MatchLabelId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    LabelText: {
        type: DataTypes.STRING
    },
    valid: {
        type: DataTypes.INTEGER,
        default: 1
    }
}, {
    indexes: [{
        name: 'matchLabel_labeltext',
        fields: ['LabelText']
    }
    ]
});

matchLabel.sync()

module.exports = matchLabel