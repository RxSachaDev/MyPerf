const User = require('./User');
const Exercise = require('./Exercise');
const Performance = require('./Performance');
const Serie = require('./Serie');

// Associations

User.hasMany(Performance, { 
    foreignKey: 'userId',
    onDelete: 'CASCADE'
});
Performance.belongsTo(User, {
     foreignKey: 'userId' 
});
Performance.hasMany(Exercise, {
     foreignKey: 'exerciseId',
     onDelete: 'CASCADE'
});
Exercise.belongsToMany(Performance, {
     foreignKey: 'exerciseId' 
});
Performance.hasMany(Serie, {
     foreignKey: 'performanceId',
     onDelete: 'CASCADE' 
});
Serie.belongsTo(Performance, {
     foreignKey: 'performanceId' 
});

module.exports = {
    User,
    Exercise,
    Performance,
    Serie
};
