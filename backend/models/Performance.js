const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const e = require('express');

const Performance = sequelize.define('Performance', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4
    },
    date : {
        type: DataTypes.DATE,
        allowNull: false
    },
    notes : {
        type: DataTypes.TEXT,
        allowNull: true
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    exerciseId: {
        type: DataTypes.UUID,
        allowNull: false
    }
})

module.exports = Performance;