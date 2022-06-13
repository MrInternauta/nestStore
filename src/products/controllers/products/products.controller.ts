import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { ParseIntPipe } from 'src/common/parse-int.pipe';
import { ProductsService } from 'src/products/services/products.service';
import {
  CreateProductDto,
  UpdateProductDto,
} from 'src/products/dtos/product.dto';
@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  //Getting obj query Params: @Query() params: any and params.limit
  @Get()
  @HttpCode(HttpStatus.OK)
  getProducts(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    // @Query('offset') offset = 10,
  ) {
    return { products: this.productsService.findAll(page, limit) };
  }

  //First router with static path
  @Get('filter')
  @HttpCode(HttpStatus.OK)
  getProductFilter(@Res() res: Response) {
    return res.json({ message: `Soy filtro` });
  }

  //Getting obj params: Can use  Param() params: any and params.productId
  @Get(':productId')
  @HttpCode(HttpStatus.OK)
  getProduct(
    @Res() res: Response,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return res.json({
      product: this.productsService.findOne(productId),
    });
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  create(@Body() product: CreateProductDto) {
    return {
      message: 'Product created',
      product: this.productsService.create(product),
    };
  }

  @Put(':productId')
  update(
    @Res() res: Response,
    @Param('productId', ParseIntPipe) productId: number,
    @Body() product: UpdateProductDto,
  ) {
    const wasUpdated = this.productsService.update(productId, product);
    if (wasUpdated) {
      return res.status(HttpStatus.OK).json({
        message: `Product updated: ${productId}`,
        product: wasUpdated,
      });
    } else {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: `Can't update the product: ${productId}`,
      });
    }
  }

  //Use ParseIntPipe to parse the param to int (in the traspilation to JS)
  @Delete(':productId')
  delete(
    @Res() res: Response,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    const wasDeleted = this.productsService.delete(productId);
    if (wasDeleted) {
      res.status(HttpStatus.OK).json({
        message: `Product deleted: ${productId}`,
      });
    } else {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: `Can't delete the product: ${productId}`,
      });
    }
  }
}