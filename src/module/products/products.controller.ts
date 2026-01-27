import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, Request, UseGuards } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../decorators/roles.decorator';
import { BadRequestException } from '../../exceptions';
import { AuthGuard } from '../../guards/jwt.guard';
import { RolesUser } from '../../guards/role.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { FilesService } from '../../upload/files.service';
import { IdDto } from './dto';
import { CreateProductDto } from './dto/create-product.dto';
import { GetProductsQueryDto } from './dto/get-products.query.dto';
import type { ProductRequest } from './dto/product.types';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private filesService: FilesService,
  ) {}

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

  @UseGuards(AuthGuard, RolesGuard)
  @Roles([RolesUser.seller, RolesUser.admin])
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateProductDto })
  @ApiCreatedResponse({ description: 'Item loaded successfully' })
  @ApiOperation({ summary: 'Создание товара' })
  @Post('')
  async createProducts(@Req() req: any) {
    const body: Record<string, any> = {};
    const fileNames: string[] = [];
    const parts = req.parts();

    for await (const part of parts) {
      if (part.type === 'file') {
        const fileName = await this.filesService.createFile(part);
        fileNames.push(fileName);
      } else {
        body[part.fieldname] = (part as any).value;
      }
    }
    const productData = {
      title: body.title,
      description: body.description,
      price: Number(body.price) || 0,
      count: Number(body.count) || 0,
      userId: req.user.id,
      categoryId: body.categoryId,
      images: fileNames,
    };

    if (!productData.title) {
      throw new BadRequestException('Поле title не дошло до сервера!');
    }
    return this.productsService.createProduct(productData as CreateProductDto);
  }

  // удаление товара
  @UseGuards(AuthGuard, RolesGuard)
  @Roles([RolesUser.seller, RolesUser.admin])
  @ApiCreatedResponse({ description: 'Item loaded successfully' })
  @ApiOperation({ summary: 'Удаление товара' })
  @Delete(':id')
  async delete(@Param() params: IdDto, @Request() req: ProductRequest) {
    return await this.productsService.delete(params, req.user);
  }

  // товары продавца
  @UseGuards(AuthGuard, RolesGuard)
  @Roles([RolesUser.seller, RolesUser.admin])
  @ApiCreatedResponse({ description: 'Products loaded' })
  @ApiOperation({ summary: 'Товары продавца' })
  @Get('my')
  async getMyProduct(@Request() req: ProductRequest) {
    return await this.productsService.getMyProduct(req.user);
  }

  // редактирование своего товара
  @UseGuards(AuthGuard, RolesGuard)
  @Roles([RolesUser.seller, RolesUser.admin])
  @ApiCreatedResponse({ description: 'Product has been edited' })
  @ApiOperation({ summary: 'Редактирование товара' })
  @Patch(':id')
  async updateMyProduct(@Param() params: IdDto, @Body() dto: UpdateProductDto, @Request() req: ProductRequest) {
    return await this.productsService.updateMyProduct(params, dto, req.user);
  }
}
