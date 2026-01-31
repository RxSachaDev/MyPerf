import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

/* -------- TYPES -------- */

interface SerieAttributes {
  id: string;
  repetitions: number;
  performanceId: string;
}

interface SerieCreationAttributes
  extends Optional<SerieAttributes, 'id'> {}

/* -------- MODEL -------- */

class Serie
  extends Model<SerieAttributes, SerieCreationAttributes>
  implements SerieAttributes
{
  public id!: string;
  public repetitions!: number;
  public performanceId!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Serie.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4
    },
    repetitions: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    performanceId: {
      type: DataTypes.UUID,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'Serie',
    tableName: 'Series' 
  }
);

export default Serie;
