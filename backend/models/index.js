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

Performance.belongsToMany(Exercise, {
    through: 'PerformanceExercises',
    foreignKey: 'performanceId',
    otherKey: 'exerciseId',
    onDelete: 'CASCADE'
});

Exercise.belongsToMany(Performance, {
    through: 'PerformanceExercises',
    foreignKey: 'exerciseId',
    otherKey: 'performanceId',
    onDelete: 'CASCADE'
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
