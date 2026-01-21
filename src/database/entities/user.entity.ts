import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { RolesUser } from '../../guards/role.guard';

@Table({ tableName: 'users' })
export class UserEntity extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare public id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  public name: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  public email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  public password: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  public active: boolean;

  @Column({
    type: DataType.ENUM,
    values: [RolesUser.user, RolesUser.seller],
    allowNull: false,
    defaultValue: RolesUser.user,
  })
  public role: RolesUser;
}
