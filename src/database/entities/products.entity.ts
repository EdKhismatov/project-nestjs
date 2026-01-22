import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { CategoryEntity } from './category.entity';
import { UserEntity } from './user.entity';

@Table({ tableName: 'products' })
export class ProductsEntity extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare public id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  public title: string;

  @Column({ type: DataType.TEXT, allowNull: false, defaultValue: 'Описание отсутствует' })
  public description: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  public count: number;

  @ForeignKey(() => UserEntity)
  @Column({ type: DataType.UUID, allowNull: false })
  public userId: string;

  @BelongsTo(() => UserEntity, { as: 'seller', foreignKey: 'userId' })
  public seller: UserEntity;

  @ForeignKey(() => CategoryEntity)
  @Column({ type: DataType.UUID, allowNull: false })
  public categoryId: string;

  @BelongsTo(() => CategoryEntity, { as: 'category', foreignKey: 'categoryId' })
  public category: CategoryEntity;
}
