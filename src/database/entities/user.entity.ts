import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { RolesUser } from '../../guards/role.guard';
import { ProductsEntity } from './products.entity';

@Table({ tableName: 'users', paranoid: true })
export class UserEntity extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare public id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare public name: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  declare public email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare public password: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  declare public active: boolean;

  @Column({
    type: DataType.ENUM,
    values: [RolesUser.user, RolesUser.seller],
    allowNull: false,
    defaultValue: RolesUser.user,
  })
  declare public role: RolesUser;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare deletedAt: Date;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  })
  declare isVerified: boolean;

  @Column({
    type: DataType.STRING,
  })
  declare verificationToken: string;

  @HasMany(() => ProductsEntity, { foreignKey: 'userId', as: 'products', onDelete: 'CASCADE' })
  declare public products: ProductsEntity[];
}
