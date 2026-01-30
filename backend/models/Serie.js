const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Serie = sequelize.define('Serie', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4
    },
    repetitions : {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    performanceId: {
        type: DataTypes.UUID,
        allowNull: false
    }
})

module.exports = Serie;