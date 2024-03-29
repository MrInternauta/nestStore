import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CategoriesController } from './controllers/categories.controller';
import { ProductsController } from './controllers/products.controller';
import { Category } from './entities/category.entity';
import { Product } from './entities/product.entity';
import { CategoriesService } from './services/categories.service';
import { ProductsService } from './services/products.service';

@Module({
  providers: [ProductsService, CategoriesService],
  imports: [TypeOrmModule.forFeature([Product, Category])],
  exports: [ProductsService, CategoriesService],
  controllers: [ProductsController, CategoriesController],
})
export class ProductsModule {}
