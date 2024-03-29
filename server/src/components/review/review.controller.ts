import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { Auth } from '@src/decorators/auth.decorator';
import { User } from '@src/decorators/user.decorator';
import { ReviewDto } from './dto/review.dto';
import { ReviewService } from './review.service';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { review } from '@src/config/docs';
import { FilterDto } from './dto/filter.dto';
import { User as PrismaUser } from '@prisma/client';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ServerUrl } from '@src/decorators/server-url.decorator';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @ApiOperation(review.byProductId.operation)
  @ApiResponse(review.byProductId.response)
  @ApiParam(review.byProductId.param)
  @Get(':id')
  public getAll(
    @Param('id', ParseIntPipe) productId: number,
    @Query() dto: FilterDto,
  ) {
    return this.reviewService.getAll(productId, dto);
  }

  @ApiOperation(review.avg.operation)
  @ApiResponse(review.avg.response)
  @ApiParam(review.avg.param)
  @Get('/avg/:id')
  public getAvgRating(@Param('id', ParseIntPipe) productId: number) {
    return this.reviewService.getAvgRating(productId);
  }

  @Get('/statistic/:id')
  public getStatistic(@Param('id', ParseIntPipe) productId: number) {
    return this.reviewService.getStatistic(productId);
  }

  @ApiOperation(review.create.operation)
  @ApiResponse(review.create.response)
  @ApiParam(review.create.param)
  @ApiBody({ type: ReviewDto })
  @Auth()
  @UseInterceptors(FilesInterceptor('files[]', 10))
  @HttpCode(200)
  @Post('/:id')
  public create(
    @ServerUrl() serverUrl: string,
    @Param('id', ParseIntPipe) productId: number,
    @Body() dto: ReviewDto,
    @User('id') userId: number,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.reviewService.create({
      productId,
      userId,
      dto,
      files,
      serverUrl,
    });
  }

  @Auth()
  @HttpCode(200)
  @Delete(':id')
  public async deleteReview(
    @User() user: PrismaUser,
    @Param('id', ParseIntPipe) reviewId: number,
  ) {
    return this.reviewService.delete(user, reviewId);
  }
}
