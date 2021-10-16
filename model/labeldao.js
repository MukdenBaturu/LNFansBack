const dbConnection = require('../db/dbconnection')
const { DataTypes } = require("sequelize")

const Label = dbConnection.define('Label', {
    labelId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    labelText: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    }
}, {
    charset: 'utf8',
    indexes: [{
        name: 'label_text',
        fields: ['labelText'],
        unique: true
    }]
})

Label.sync()

module.exports = Label