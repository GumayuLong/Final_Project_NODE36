import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Res,
} from '@nestjs/common';
import { DatPhongService } from './dat-phong.service';
import { CreateDatPhongDto } from './dto/create-dat-phong.dto';
import { UpdateDatPhongDto } from './dto/update-dat-phong.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('DatPhong')
@Controller('/api/dat-phong')
export class DatPhongController {
  constructor(private readonly datPhongService: DatPhongService) {}

  @Get()
  fetchDatPhong(@Res() res): any {
    return this.datPhongService.fetchDatPhongApi(res);
  }

  @Post()
  createDatPhong(@Body() body: CreateDatPhongDto, @Res() res): any {
    return this.datPhongService.createDatPhongApi(body, res);
  }

  @Get('/:id')
  getInfoDatPhongTheoId(@Param('id') idDatPhong: number, @Res() res): any {
    return this.datPhongService.getInfoDatPhongTheoIdApi(idDatPhong, res);
  }

  @Put('/:id')
  updateDatPhong(
    @Body() body: UpdateDatPhongDto,
    @Param('id') idDatPhong: number,
    @Res() res,
  ): any {
    return this.datPhongService.updateDatPhongApi(body, idDatPhong, res);
  }

  @Delete('/:id')
  deleteDatPhong(@Param('id') idDatPhong: number, @Res() res): any {
    return this.datPhongService.deleteDatPhongApi(idDatPhong, res);
  }

  @Get('/lay-theo-nguoi-dung/:MaNguoiDung')
  getInfoDatPhongTheoNguoiDung(
    @Param('MaNguoiDung') maNguoiDung: number,
    @Res() res,
  ): any {
    return this.datPhongService.getInfoDatPhongBaseOnNguoiDung(
      maNguoiDung,
      res,
    );
  }
}
