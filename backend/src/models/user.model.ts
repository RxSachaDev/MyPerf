import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import jwt from 'jsonwebtoken';

/* -------- TYPES -------- */

interface UserAttributes {
  id: string;
  name: string;
  mail: string;
  password: string;
}

interface UserCreationAttributes
  extends Optional<UserAttributes, 'id'> {}

/* -------- MODEL -------- */

class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: string;
  public name!: string;
  public mail!: string;
  public password!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  /* -------- METHODS -------- */

  generateAuthToken(): string {
    return jwt.sign(
      { userId: this.id },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    );
  }

  toJSON() {
    const values = { ...this.get() } as Partial<UserAttributes>;
    delete values.password;
    return values;
  }

  /* -------- STATIC METHODS -------- */

  static async findByMail(mail: string): Promise<User | null> {
    return await User.findOne({ where: { mail } });
  }
}

/* -------- INIT -------- */

User.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    mail: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'Users'
  }
);

export default User;
