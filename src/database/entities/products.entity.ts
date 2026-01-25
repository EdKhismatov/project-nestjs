import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { CategoryEntity } from './category.entity';
import { UserEntity } from './user.entity';

@Table({ tableName: 'products', paranoid: true })
export class ProductsEntity extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare public id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare public title: string;

  @Column({ type: DataType.TEXT, allowNull: false, defaultValue: 'Описание отсутствует' })
  declare public description: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  declare public count: number;

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
  declare public price: number;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare deletedAt: Date;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    defaultValue: [],
  })
  declare images: string[];

  @ForeignKey(() => UserEntity)
  @Column({ type: DataType.UUID, allowNull: false })
  declare public userId: string;

  @BelongsTo(() => UserEntity, { as: 'seller', foreignKey: 'userId' })
  declare public seller: UserEntity;

  @ForeignKey(() => CategoryEntity)
  @Column({ type: DataType.UUID, allowNull: false })
  declare public categoryId: string;

  @BelongsTo(() => CategoryEntity, { as: 'category', foreignKey: 'categoryId' })
  declare public category: CategoryEntity;
}
