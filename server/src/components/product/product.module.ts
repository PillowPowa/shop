import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { PrismaService } from 'src/prisma.service';
import { PaginationService } from 'src/components/pagination/pagination.service';
import { CategoryModule } from 'src/components/category/category.module';

@Module({
  controllers: [ProductController],
  providers: [ProductService, PrismaService, PaginationService],
  imports: [CategoryModule],
})
export class ProductModule {}