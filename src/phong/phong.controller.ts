import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Query,
  Put,
  UseInterceptors,
  UploadedFile,
  Res,
} from '@nestjs/common';
import { PhongService } from './phong.service';
import { CreatePhongDto } from './dto/create-phong.dto';
import { UpdatePhongDto } from './dto/update-phong.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { UpLoadHinhPhongDto } from './dto/hinh-phong.dto';
import { PrismaClient } from '@prisma/client';

@ApiTags('Phong')
@Controller('/api/phong')
export class PhongController {
  prisma = new PrismaClient();
  constructor(private readonly phongService: PhongService) {}

  @Get()
  fetchPhongThue(@Res() res): any {
    return this.phongService.fetchPhongThueApi(res);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post()
  createPhongThue(@Body() body: CreatePhongDto, @Res() res): any {
    return this.phongService.createPhongThueApi(body, res);
  }

  @Get('/lay-phong-theo-vi-tri')
  getPhongBaseOnLocation(@Query('maViTri') maViTri: number, @Res() res): any {
    return this.phongService.getPhongBaseOneLocationApi(maViTri, res);
  }

  @Get('/phan-trang-tim-kiem')
  @ApiQuery({
    name: 'keyword',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'pageIndex',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    type: Number,
  })
  phanTrangPhong(
    @Query('pageIndex') pageIndex: number,
    @Query('pageSize') pageSize: number,
    @Query('keyword') keyword: string,
    @Res() res,
  ): any {
    return this.phongService.phanTrangPhongApi(
      pageIndex,
      pageSize,
      keyword,
      res,
    );
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpLoadHinhPhongDto })
  @Post('/upload-hinh-phong')
  @UseInterceptors(
    FileInterceptor('formFile', {
      storage: diskStorage({
        destination: process.cwd() + '/public/img',
        filename: async (req, file, callback) => {
          callback(null, new Date().getTime() + `_${file.originalname}`);
        },
      }),
    }),
  )
  async uploadAva(
    @Query('maPhong') maPhong: number,
    @UploadedFile() file: Express.Multer.File,
    @Res() res,
  ) {
    return this.phongService.uploadHinhPhongApi(maPhong, file, res);
  }

  @Get('/:id')
  getPhongBaseOnId(@Param('id') idPhong: number, @Res() res): any {
    return this.phongService.getPhongBaseOnIdApi(idPhong, res);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Put('/:id')
  updatePhongThue(
    @Body() body: UpdatePhongDto,
    @Param('id') idPhong: number,
    @Res() res,
  ): any {
    return this.phongService.updatePhongThueApi(body, idPhong, res);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete('/:id')
  deletePhongThue(@Param('id') idPhong: number, @Res() res): any {
    return this.phongService.deletePhongThueApi(idPhong, res);
  }
}
