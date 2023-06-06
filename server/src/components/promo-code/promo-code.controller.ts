import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { PromoCodeService } from './promo-code.service';
import { CreatePromoCodeDto } from './dto/create-promo-code.dto';
import { Auth } from '../../decorators/auth.decorator';
import { Role, Roles } from '../../decorators/roles.decorator';

@Controller('promo-codes')
export class PromoCodeController {
  constructor(private readonly promoCodesService: PromoCodeService) {}

  @Post()
  @Auth()
  @Roles(Role.Admin)
  create(@Body() createPromoCodeDto: CreatePromoCodeDto) {
    return this.promoCodesService.create(createPromoCodeDto);
  }

  @Get(':name')
  findOne(@Param('name') promoName: string) {
    return this.promoCodesService.findOne({ where: { name: promoName } });
  }

  @Delete(':id')
  @Auth()
  @Roles(Role.Admin)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.promoCodesService.remove(id);
  }
}
