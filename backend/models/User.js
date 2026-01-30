const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const jwt = require('jsonwebtoken')

const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4
    },
    name : {
        type: DataTypes.STRING,
        allowNull: false
    },
    mail : {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password : {
        type: DataTypes.STRING,
        allowNull: false
    }
});

User.prototype.generateAuthToken = function() {
    const token = jwt.sign(
        {
            userId: this.id
        },
        process.env.JWT_SECRET,
        {
            expiresIn : '7d'
        }
    ) 
    return token;
};

User.prototype.toJSON = function() {
    const values = Object.assign({}, this.get());
    delete values.password;
    return values
}

module.exports = User;