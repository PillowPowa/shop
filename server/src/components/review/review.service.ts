import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ReviewDto } from './dto/review.dto';
import { reviewSelect } from './prisma.partials';
import { NotFoundException } from '@nestjs/common/exceptions';
import { PaginationService } from '../pagination/pagination.service';
import type { FilterDto } from './dto/filter.dto';
import {Prisma} from "@prisma/client";
import {ReviewSort} from "./dto/filter.dto";

@Injectable()
export class ReviewService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService,
  ) {}

  public async getAvgRating(productId: number) {
    const data = await this.prisma.review.aggregate({
      where: { productId },
      _avg: { rating: true },
    });
    return data._avg.rating || 0;
  }
  public async getAll(productId: number, dto: FilterDto) {
    const prismaSort: Prisma.ReviewOrderByWithRelationInput[] = [];
    switch (dto.sort) {
      case ReviewSort.Oldest:
        prismaSort.push({ createdAt: 'asc' });
        break;
      case ReviewSort.Better:
        prismaSort.push({ rating: 'desc' });
        break;
      case ReviewSort.Worse:
        prismaSort.push({ rating: 'asc' });
        break;
      default:
        prismaSort.push({ createdAt: 'desc' });
    }

    const { skip, perPage } = this.paginationService.getPagination(dto);
    const reviews = await this.prisma.review.findMany({
      where: { productId },
      orderBy: prismaSort,
      take: perPage,
      skip,
      select: reviewSelect,
    });
    return {
      reviews,
      length: await this.countReviews(productId),
    };
  }
  public async getStatistic(productId: number) {
    const reviews = await this.prisma.review.groupBy({
      where: { productId },
      by: ['rating'],
      _count: { rating: true },
      _avg: { rating: true },
    });

    const totalRating = Object.fromEntries(
      reviews.map((review) => [review.rating, review._count.rating]),
    );
    const count = await this.countReviews(productId);

    return {
      avg: await this.getAvgRating(productId),
      intervalCounts: Array.from({ length: 5 }, (_, index) => {
        return {
          percentages: ((totalRating[index + 1] || 0) / count) * 100,
          intervalCounts: totalRating[index + 1] || 0,
          rate: index + 1,
        };
      }),
    };
  }

  public async create(userId: number, productId: number, dto: ReviewDto) {
    try {
      return await this.prisma.review.create({
        data: {
          ...dto,
          user: {
            connect: { id: userId },
          },
          product: {
            connect: { id: productId },
          },
        },
        select: reviewSelect,
      });
    } catch {
      throw new NotFoundException('Product not found');
    }
  }

  private async countReviews(productId: number) {
    return this.prisma.review.count({
      where: { productId },
    });
  }
}
