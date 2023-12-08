import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Put,
} from '@nestjs/common';
import { BinhLuanService } from './binh-luan.service';
import { CreateBinhLuanDto } from './dto/create-binh-luan.dto';
import { UpdateBinhLuanDto } from './dto/update-binh-luan.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { promises } from 'dns';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';

@ApiTags('BinhLuan')
@Controller('/api/binh-luan')
export class BinhLuanController {
  constructor(
    private readonly binhLuanService: BinhLuanService,
    private readonly jwtService: JwtService,
  ) {}

  @Get()
  getBinhLuan(): any {
    return this.binhLuanService.fetchBinhLuanApi();
  }

  // @ApiBearerAuth()
  // @UseGuards(AuthGuard('jwt'))
  // @Post()
  // createBinhLuan(@Headers() header: any, @Body() body: CreateBinhLuanDto): any {
  //   let { authorization } = header;
  //   return this.binhLuanService.createBinhLuanApi(body, authorization);
  // }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post()
  createBinhLuan(@Body() body: CreateBinhLuanDto): any {
    return this.binhLuanService.createBinhLuanApi(body);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Put('/:id')
  updateBinhLuan(
    @Body() body: UpdateBinhLuanDto,
    @Param('id') idBinhLuan: number,
  ): any {
    return this.binhLuanService.updateBinhLuan(body, idBinhLuan);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete('/:id')
  deleteBinhLuan(@Param('id') idBinhLuan: number): any {
    return this.binhLuanService.deleteBinhLuanApi(idBinhLuan);
  }

  @Get('/lay-binh-luan-theo-phong/:MaPhong')
  getInfoBinhLuanTheoMaPhong(@Param('MaPhong') maPhong: number): any {
    return this.binhLuanService.getInfoBinhLuanTheoMaPhongApi(maPhong);
  }
}
