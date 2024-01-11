import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Put,
  Query,
  UseInterceptors,
  UploadedFile,
  Res,
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
import { diskStorage } from 'multer';
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

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpLoadHinhViTriDto })
  @Post('/upload-hinh-vi-tri')
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
    @Query('maViTri') maViTri: number,
    @UploadedFile() file: Express.Multer.File,
    @Res() res,
  ) {
    return this.viTriService.uploadHinhViTriApi(maViTri, file, res);
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
