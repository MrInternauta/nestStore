import { BasicEntity } from 'src/common/interfaces/basic.entity';
import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  ManyToOne,
  ManyToMany,
  Index,
} from 'typeorm';
import { Brand } from './brand.entity';
import { Category } from './category.entity';
/* eslint-disable prettier/prettier */
@Entity()
@Index(['price', 'stock'])
export class Product extends BasicEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
  })
  name: string;

  @Column({
    type: 'text',
  })
  description: string;

  @Column({ type: 'int' })
  //@Index()
  price: number;

  @Column({ type: 'int' })
  stock: number;

  @Column({ type: 'varchar' })
  image: string;

  @ManyToOne(() => Brand, (brand) => brand.products, { nullable: true })
  // La que tiene relacion many to one, tiene la llave foranea @JoinColumn()
  brand: Brand;

  @ManyToMany(() => Category, (category) => category.products, {
    nullable: false,
  })
  // La que tiene relacion many to one, tiene la llave foranea @JoinColumn()
  categories: Category[];
}
