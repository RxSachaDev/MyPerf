import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

/* -------- TYPES -------- */

interface ExerciseAttributes {
  id: string;
  name: string;
  category: string;
  muscles: string;
}

/* -------- MODEL -------- */

class Exercise extends Model<ExerciseAttributes> implements ExerciseAttributes {
  public id!: string;
  public name!: string;
  public category!: string;
  public muscles!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  /* -------- STATIC METHODS -------- */

  static async findById(id: string): Promise<Exercise | null> {
    return await Exercise.findOne({ where: { id } });
  }

  static async findByName(name: string): Promise<Exercise | null> {
    return await Exercise.findOne({ where: { name } });
  }
  
  static async findByCategory(category: string): Promise<Exercise[]> {
    return await Exercise.findAll({ where: { category } });
  }

  static async findByMuscles(muscles: string): Promise<Exercise[]> {
    return await Exercise.findAll({ where: { muscles } });
  }
  
  static async findByCategoryAndMuscles(
    category: string,
    muscles: string
  ): Promise<Exercise[]> {
    return await Exercise.findAll({
      where: {
        category,
        muscles,
      },
    });
  }
}

Exercise.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    muscles: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Exercise",
    tableName: "Exercises",
  },
);

export default Exercise;
