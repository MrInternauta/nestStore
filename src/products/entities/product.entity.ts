import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { BasicEntity } from '../../core/interfaces/basic.entity';
import { Category } from './category.entity';

/* eslint-disable prettier/prettier */
@Entity({
  name: 'products',
}) //naming table
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

  @Column({
    type: 'text',
  })
  code: string;

  @Column({ type: 'int' })
  //@Index()
  price: number;

  @Column({ type: 'int' })
  //@Index()
  priceSell: number;

  @Column({ type: 'int' })
  stock: number;

  @Column({ type: 'varchar' })
  image: string;

  @ManyToOne(() => Category, category => category.products, { nullable: true })
  @JoinColumn({
    name: 'id_category',
  }) //naming  n to 1
  category: Category;
}
