import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

/* -------- TYPES -------- */

interface PerformanceAttributes {
  id: string;
  date: Date;
  notes?: string;
  userId: string;
  exerciseId: string;
}

interface PerformanceCreationAttributes
  extends Optional<PerformanceAttributes, 'id' | 'notes'> {}

/* -------- MODEL -------- */

class Performance
  extends Model<PerformanceAttributes, PerformanceCreationAttributes>
  implements PerformanceAttributes
{
  public id!: string;
  public date!: Date;
  public notes?: string;
  public userId!: string;
  public exerciseId!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  /* -------- STATIC METHODS -------- */

  static async findById(id: string): Promise<Performance | null> {
    return await Performance.findOne({ where: { id } });
  }

  static async findAllPerformances(filters: any = {}) {
    return await Performance.findAll({
      where: filters,
      order: [["date", "DESC"]]
    });
  }
}

Performance.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    notes: {
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
  },
  {
    sequelize,
    modelName: 'Performance',
    tableName: 'Performances'
  }
);

export default Performance;
