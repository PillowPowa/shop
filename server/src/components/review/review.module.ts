import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { PrismaService } from '../../prisma.service';
import { PaginationService } from '../pagination/pagination.service';
import { UploadService } from '../upload/upload.service';

@Module({
  controllers: [ReviewController],
  providers: [ReviewService, PrismaService, PaginationService, UploadService],
})
export class ReviewModule {}
