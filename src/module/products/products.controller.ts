import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../decorators/roles.decorator';
import { AuthGuard } from '../../guards/jwt.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { IdDto } from './dto';
import { CreateProductDto } from './dto/create-product.dto';
import { GetProductsQueryDto } from './dto/get-products.query.dto';
import type { ProductRequest } from './dto/product.types';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // все товары (сделать пагинацию)
  @ApiCreatedResponse({ description: 'Goods loaded successfully' })
  @ApiOperation({ summary: 'Товары загружены' })
  @Get()
  async getProductsAll(@Query() query: GetProductsQueryDto) {
    return await this.productsService.getProductsAll(query);
  }

  // товар по id, с категорией и владельцем
  @ApiCreatedResponse({ description: 'Item loaded successfully' })
  @ApiOperation({ summary: 'Товар загружен' })
  @Get(':id')
  async getProductsId(@Param() params: IdDto) {
    return await this.productsService.getProductsId(params);
  }

  // создание товара
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['seller', 'admin'])
  @ApiCreatedResponse({ description: 'Item loaded successfully' })
  @ApiOperation({ summary: 'Создание товара' })
  @Post('')
  async createProducts(@Body() body: CreateProductDto, @Request() req: ProductRequest) {
    return await this.productsService.createProducts(body, req.user.id);
  }

  // удаление товара
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['seller', 'admin'])
  @ApiCreatedResponse({ description: 'Item loaded successfully' })
  @ApiOperation({ summary: 'Удаление товара' })
  @Delete(':id')
  async delete(@Param() params: IdDto, @Request() req: ProductRequest) {
    return await this.productsService.delete(params, req.user);
  }

  // товары продавца
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['seller', 'admin'])
  @ApiCreatedResponse({ description: 'Products loaded' })
  @ApiOperation({ summary: 'Товары продавца' })
  @Get('my')
  async getMyProduct(@Request() req: ProductRequest) {
    return await this.productsService.getMyProduct(req.user);
  }

  // редактирование своего товара
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['seller', 'admin'])
  @ApiCreatedResponse({ description: 'Product has been edited' })
  @ApiOperation({ summary: 'Редактирование товара' })
  @Patch(':id')
  async updateMyProduct(@Param() params: IdDto, @Body() dto: UpdateProductDto, @Request() req: ProductRequest) {
    return await this.productsService.updateMyProduct(params, dto, req.user);
  }
}
