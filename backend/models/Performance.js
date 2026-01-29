const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const e = require('express');

const Performance = sequelize.define('Performance', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
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
        type: DataTypes.INTEGER,
        allowNull: false
    },
    exerciseId: {
        type: DataTypes.UUID,
        allowNull: false
    }
})