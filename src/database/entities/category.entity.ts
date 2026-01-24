import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript';
import { ProductsEntity } from './products.entity';
import { UserEntity } from './user.entity';

@Table({ tableName: 'category' })
export class CategoryEntity extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare public id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare public title: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  declare public slug: string;

  @Column({ type: DataType.TEXT, allowNull: false, defaultValue: 'Описание отсутствует' })
  declare public description: string;

  @Column({ type: DataType.STRING, allowNull: false, defaultValue: 'Иконка отсутствует' })
  declare public icon: string;

  @ForeignKey(() => UserEntity)
  @Column({ type: DataType.UUID, allowNull: false })
  declare public userId: string;

  @BelongsTo(() => UserEntity, { as: 'creator', foreignKey: 'userId' })
  declare public owner: UserEntity;

  @HasMany(() => ProductsEntity, { foreignKey: 'categoryId', as: 'products', onDelete: 'CASCADE' })
  declare public products: ProductsEntity[];
}
