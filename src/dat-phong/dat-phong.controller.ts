import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
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
  fetchDatPhong(): any {
    return this.datPhongService.fetchDatPhongApi();
  }

  @Post()
  createDatPhong(@Body() body: CreateDatPhongDto): any {
    return this.datPhongService.createDatPhongApi(body);
  }

  @Get('/:id')
  getInfoDatPhongTheoId(@Param('id') idDatPhong: number): any {
    return this.datPhongService.getInfoDatPhongTheoIdApi(idDatPhong);
  }

  @Put('/:id')
  updateDatPhong(
    @Body() body: UpdateDatPhongDto,
    @Param('id') idDatPhong: number,
  ): any {
    return this.datPhongService.updateDatPhongApi(body, idDatPhong);
  }

  @Delete('/:id')
  deleteDatPhong(@Param('id') idDatPhong: number): any {
    return this.datPhongService.deleteDatPhongApi(idDatPhong);
  }

  @Get('/lay-theo-nguoi-dung/:MaNguoiDung')
  getInfoDatPhongTheoNguoiDung(@Param('MaNguoiDung') maNguoiDung: number): any {
    return this.datPhongService.getInfoDatPhongBaseOnNguoiDung(maNguoiDung);
  }
}
