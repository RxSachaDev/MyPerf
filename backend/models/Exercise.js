const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Exercise = sequelize.define('Exercise', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
    },
    name : {
        type: DataTypes.STRING,
        allowNull: false
    },
    category : {
        type: DataTypes.STRING,
        allowNull: false
    },
    muscles : {
        type: DataTypes.STRING,
        allowNull: false
    }
})