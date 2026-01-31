import User from './user.model';
import Exercise from './exercise.model';
import Performance from './performance.model';
import Serie from './serie.model';

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

export {
  User,
  Exercise,
  Performance,
  Serie
};
