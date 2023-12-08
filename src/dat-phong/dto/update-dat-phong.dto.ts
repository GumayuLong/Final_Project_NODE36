import { PartialType } from '@nestjs/mapped-types';
import { CreateDatPhongDto } from './create-dat-phong.dto';
import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateDatPhongDto extends PartialType(CreateDatPhongDto) {
  @IsNotEmpty({ message: 'ma_phong không được bỏ trống!' })
  @ApiProperty()
  ma_phong: number;

  @IsNotEmpty({ message: 'ngay_den không được bỏ trống!' })
  @ApiProperty()
  ngay_den: Date;

  @IsNotEmpty({ message: 'ngay_di không được bỏ trống!' })
  @ApiProperty()
  ngay_di: Date;

  @IsNotEmpty({ message: 'so_luong_khach không được bỏ trống!' })
  @ApiProperty()
  so_luong_khach: number;

  @IsNotEmpty({ message: 'ma_nguoi_dat không được bỏ trống!' })
  @ApiProperty()
  ma_nguoi_dat: number;
}
