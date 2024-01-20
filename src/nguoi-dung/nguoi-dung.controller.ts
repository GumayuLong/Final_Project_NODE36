import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Put,
  Query,
  UseGuards,
  Headers,
  Res,
  BadRequestException,
  ParseArrayPipe,
  ParseFilePipe,
} from '@nestjs/common';
import { NguoiDungService } from './nguoi-dung.service';
import { CreateNguoiDungDto } from './dto/create-nguoi-dung.dto';
import { UpdateNguoiDungDto } from './dto/update-nguoi-dung.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { FileUploadDto } from './dto/formData-dto';

@ApiTags('NguoiDung')
@Controller('/api/nguoi-dung')
export class NguoiDungController {
  constructor(private readonly nguoiDungService: NguoiDungService) {}

  @Get()
  fetchNguoiDung(@Res() res): any {
    return this.nguoiDungService.fetchNguoiDungApi(res);
  }

  @Post()
  createNguoiDung(@Body() body: CreateNguoiDungDto, @Res() res): any {
    return this.nguoiDungService.createNguoiDungApi(body, res);
  }

  @Delete('/:id')
  deleteNguoiDung(@Param('id') id: number, @Res() res): any {
    return this.nguoiDungService.deleteNguoiDungApi(id, res);
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
  phanTrangUser(
    @Query('pageIndex') pageIndex: number,
    @Query('pageSize') pageSize: number,
    @Query('keyword') keyword: string,
    @Res() res,
  ): any {
    return this.nguoiDungService.phanTrangUserApi(
      pageIndex,
      pageSize,
      keyword,
      res,
    );
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('/upload-avatar')
  @UseInterceptors(FileInterceptor('formFile'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: FileUploadDto })
  async uploadFile(
    @Query('id') idUser: number,
    @Res() res,
    @UploadedFile(
      new ParseFilePipe({
        validators: [],
      }),
    )
    file: Express.Multer.File,
  ) {
    const key = `${file.originalname}${Date.now()}`;
    await this.nguoiDungService.uploadAvatar(idUser, file, key, res);
  }

  @Get('/:id')
  getInfoNguoiDungTheoId(@Param('id') id: number, @Res() res): any {
    return this.nguoiDungService.getInfoNguoiDungTheoIdApi(id, res);
  }

  @Put('/:id')
  updateNguoiDung(
    @Body() body: UpdateNguoiDungDto,
    @Param('id') id: number,
    @Res() res,
  ): any {
    return this.nguoiDungService.updateNguoiDungApi(body, id, res);
  }

  @Get('/search/:TenNguoiDung')
  searchNguoiDung(
    @Param('TenNguoiDung') tenNguoiDung: string,
    @Res() res,
  ): any {
    return this.nguoiDungService.searchNguoiDungApi(tenNguoiDung, res);
  }
}
