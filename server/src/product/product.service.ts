import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { productFullestSelect, productSelect } from './prisma.partials';
import { ProductDto } from './dto/product.dto';
import slugify from 'src/utils/slugify';
import { FilterDto, ProductSort } from './dto/filter.dto';
import { PaginationService } from 'src/pagination/pagination.service';
import { CategoryService } from 'src/category/category.service';

@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly pagination: PaginationService,
    private readonly categoryService: CategoryService,
  ) {}

  public async getProducts({ sort, term }: FilterDto) {
    const prismaSort: Prisma.ProductOrderByWithRelationInput[] = [];
    switch (sort) {
      case ProductSort.HighPrice:
        prismaSort.push({ price: 'desc' });
        break;
      case ProductSort.LowPrice:
        prismaSort.push({ price: 'asc' });
        break;
      case ProductSort.Oldest:
        prismaSort.push({ createdAt: 'asc' });
        break;
      default:
        prismaSort.push({ createdAt: 'desc' });
    }

    const prismaTermSort: Prisma.ProductWhereInput = term
      ? {
          OR: [
            { name: { contains: term, mode: 'insensitive' } },
            { description: { contains: term, mode: 'insensitive' } },
          ],
        }
      : {};

    const { skip, perPage } = this.pagination.getPagination();

    const products = await this.prisma.product.findMany({
      where: prismaTermSort,
      orderBy: prismaSort,
      skip,
      take: perPage,
    });

    return {
      products,
      length: await this.prisma.product.count({
        where: prismaTermSort,
      }),
    };
  }
  public async getProductById(productId: number) {
    if (isNaN(productId)) {
      throw new BadRequestException('Invalid product id');
    }
    return this.getProductByQuery({ id: productId }, productFullestSelect);
  }
  public async getProductByQuery(
    query: Prisma.ProductWhereUniqueInput,
    select: Prisma.ProductSelect = productSelect,
  ) {
    const product = await this.prisma.product.findUnique({
      where: query,
      select,
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }
  public async getByCategory(categorySlug: string) {
    return this.prisma.product.findMany({
      where: {
        category: {
          some: { slug: categorySlug },
        },
      },
      select: productSelect,
    });
  }
  public async getSimilar(productId: number) {
    const product = await this.getProductById(productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return this.prisma.product.findMany({
      where: {
        category: {
          some: { name: product.category[0].name },
        },
        id: {
          not: productId,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: productSelect,
    });
  }
  public async create(userId: number) {
    const { id } = await this.prisma.product.create({
      data: {
        name: '',
        slug: '',
        description: '',
        sold: 0,
        quantity: 0,
        price: 0,
        userId,
      },
    });
    return id;
  }
  public async update(productId: number, userId: number, dto: ProductDto) {
    if (isNaN(productId)) {
      throw new BadRequestException('Invalid product id');
    }

    const { categoryId, ...data } = dto;

    const isCategoryExist = await this.categoryService.getCategoryByQuery({
      id: categoryId,
    });

    if (!isCategoryExist) {
      throw new NotFoundException('Category not found');
    }

    const product = await this.getProductByQuery(
      { id: productId },
      { userId: true },
    );

    if (userId !== product.userId) {
      throw new ForbiddenException('You are not allowed to do this action');
    }

    return this.prisma.product.update({
      where: { id: productId },
      data: {
        ...data,
        slug: slugify(data.name),
        category: {
          connect: { id: categoryId },
        },
      },
      select: productFullestSelect,
    });
  }

  public delete(productId: number) {
    if (isNaN(productId)) {
      throw new BadRequestException('Invalid product id');
    }
    return this.prisma.product.delete({
      where: { id: productId },
    });
  }
}
