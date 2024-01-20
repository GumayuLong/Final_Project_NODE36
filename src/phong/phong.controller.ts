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
  ParseFilePipe,
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

@ApiTags('Phong')
@Controller('/api/phong')
export class PhongController {
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

  // Create ava phong` (1 pic)
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpLoadHinhPhongDto })
  @Post('/upload-hinh-phong')
  @UseInterceptors(FileInterceptor('formFile'))
  async uploadAva(
    @Query('maPhong') maPhong: number,
    @UploadedFile(
      new ParseFilePipe({
        validators: [],
      }),
    )
    file: Express.Multer.File,
    @Res() res,
  ) {
    const key = `${file.originalname}${Date.now()}`;
    return this.phongService.uploadHinhPhongApi(maPhong, file, key, res);
  }

  // Update ava phong (1 pic)
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpLoadHinhPhongDto })
  @Put('/upload-hinh-phong')
  @UseInterceptors(FileInterceptor('formFile'))
  async updateAva(
    @Query('maPhong') maPhong: number,
    @UploadedFile(
      new ParseFilePipe({
        validators: [],
      }),
    )
    file: Express.Multer.File,
    @Res() res,
  ) {
    const key = `${file.originalname}${Date.now()}`;
    return this.phongService.uploadHinhPhongApi(maPhong, file, key, res);
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
