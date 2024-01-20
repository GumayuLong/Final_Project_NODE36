import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Put,
  Query,
  UseInterceptors,
  UploadedFile,
  Res,
  ParseFilePipe,
} from '@nestjs/common';
import { ViTriService } from './vi-tri.service';
import { CreateViTriDto } from './dto/create-vi-tri.dto';
import { UpdateViTriDto } from './dto/update-vi-tri.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpLoadHinhViTriDto } from './dto/hinh-vi-tri.dto';

@ApiTags('ViTri')
@Controller('/api/vi-tri')
export class ViTriController {
  constructor(private readonly viTriService: ViTriService) {}

  @Get()
  fetchViTri(@Res() res): any {
    return this.viTriService.fetchViTriApi(res);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post()
  createViTri(@Body() body: CreateViTriDto, @Res() res): any {
    return this.viTriService.createViTriApi(body, res);
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
  phanTrangViTri(
    @Query('pageIndex') pageIndex: number,
    @Query('pageSize') pageSize: number,
    @Query('keyword') keyword: string,
    @Res() res,
  ): any {
    return this.viTriService.phanTrangViTriApi(
      pageIndex,
      pageSize,
      keyword,
      res,
    );
  }

  // Update ava vi_tri
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpLoadHinhViTriDto })
  @Put('/upload-hinh-vi-tri')
  @UseInterceptors(FileInterceptor('formFile'))
  async uploadAva(
    @Query('maViTri') maViTri: number,
    @UploadedFile(
      new ParseFilePipe({
        validators: [],
      }),
    )
    file: Express.Multer.File,
    @Res() res,
  ) {
    const key = `${file.originalname}${Date.now()}`;
    return this.viTriService.uploadHinhViTriApi(maViTri, file, key, res);
  }

  // Create ava vi_tri (1 pic)
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpLoadHinhViTriDto })
  @Post(`/create-upload-hinh-vi-tri`)
  @UseInterceptors(FileInterceptor('formFile'))
  async uploadAvaCreate(
    @Query('maViTri') maViTri: number,
    @UploadedFile(
      new ParseFilePipe({
        validators: [],
      }),
    )
    file: Express.Multer.File,
    @Res() res,
  ) {
    const key = `${file.originalname}${Date.now()}`;
    return this.viTriService.createUploadHinhVitri(maViTri, file, key, res);
  }

  @Get('/:id')
  getInfoLocation(@Param('id') idViTri: number, @Res() res): any {
    return this.viTriService.getInfoLocationBaseOnId(idViTri, res);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Put('/:id')
  updateViTri(
    @Body() body: UpdateViTriDto,
    @Param('id') idViTri: number,
    @Res() res,
  ): any {
    return this.viTriService.updateLocationApi(body, idViTri, res);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete('/:id')
  deleteViTri(@Param('id') idViTri: number, @Res() res): any {
    return this.viTriService.deleteLocationApi(idViTri, res);
  }
}
