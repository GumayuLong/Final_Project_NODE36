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
} from '@nestjs/common';
import { NguoiDungService } from './nguoi-dung.service';
import { CreateNguoiDungDto } from './dto/create-nguoi-dung.dto';
import { UpdateNguoiDungDto } from './dto/update-nguoi-dung.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { IsInt } from 'class-validator';
import { AuthGuard } from '@nestjs/passport';
import { FileUploadDto } from './dto/formData-dto';

@ApiTags('NguoiDung')
@Controller('/api/nguoi-dung')
export class NguoiDungController {
  constructor(private readonly nguoiDungService: NguoiDungService) {}

  @Get()
  fetchNguoiDung(): any {
    return this.nguoiDungService.fetchNguoiDungApi();
  }

  @Post()
  createNguoiDung(@Body() body: CreateNguoiDungDto): any {
    return this.nguoiDungService.createNguoiDungApi(body);
  }

  @Delete('/:id')
  deleteNguoiDung(@Param('id') id: number): any {
    return this.nguoiDungService.deleteNguoiDungApi(id);
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
  ): any {
    return this.nguoiDungService.phanTrangUserApi(pageIndex, pageSize, keyword);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(
    FileInterceptor('formFile', {
      storage: diskStorage({
        destination: process.cwd() + '/public/img',
        filename: (req, file, callback) =>
          callback(null, new Date().getTime() + `_${file.originalname}`),
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: FileUploadDto })
  @Post('/upload-avatar')
  uploadAva(
    @Query('id') idUser: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.nguoiDungService.uploadAvatar(idUser, file);
  }

  @Get('/:id')
  getInfoNguoiDungTheoId(@Param('id') id: number): any {
    return this.nguoiDungService.getInfoNguoiDungTheoIdApi(id);
  }

  @Put('/:id')
  updateNguoiDung(
    @Body() body: UpdateNguoiDungDto,
    @Param('id') id: number,
  ): any {
    return this.nguoiDungService.updateNguoiDungApi(body, id);
  }

  @Get('/search/:TenNguoiDung')
  searchNguoiDung(@Param('TenNguoiDung') tenNguoiDung: string): any {
    return this.nguoiDungService.searchNguoiDungApi(tenNguoiDung);
  }
}
