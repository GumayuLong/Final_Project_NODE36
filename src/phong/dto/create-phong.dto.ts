import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreatePhongDto {
  @IsNotEmpty({ message: 'ten_phong không được bỏ trống!' })
  @ApiProperty()
  ten_phong: string;

  @IsNotEmpty({ message: 'khach không được bỏ trống!' })
  @ApiProperty()
  khach: number;

  @IsNotEmpty({ message: 'phong_ngu không được bỏ trống!' })
  @ApiProperty()
  phong_ngu: number;

  @IsNotEmpty({ message: 'giuong không được bỏ trống!' })
  @ApiProperty()
  giuong: number;

  @IsNotEmpty({ message: 'phong_tam không được bỏ trống!' })
  @ApiProperty()
  phong_tam: number;

  @IsNotEmpty({ message: 'mo_ta không được bỏ trống!' })
  @ApiProperty()
  mo_ta: string;

  @IsNotEmpty({ message: 'gia_tien không được bỏ trống!' })
  @ApiProperty()
  gia_tien: number;

  @IsNotEmpty({ message: 'may_giat không được bỏ trống!' })
  @ApiProperty()
  may_giat: boolean;

  @IsNotEmpty({ message: 'ban_la không được bỏ trống!' })
  @ApiProperty()
  ban_la: boolean;

  @IsNotEmpty({ message: 'tivi không được bỏ trống!' })
  @ApiProperty()
  tivi: boolean;

  @IsNotEmpty({ message: 'dieu_hoa không được bỏ trống!' })
  @ApiProperty()
  dieu_hoa: boolean;

  @IsNotEmpty({ message: 'wifi không được bỏ trống!' })
  @ApiProperty()
  wifi: boolean;

  @IsNotEmpty({ message: 'bep không được bỏ trống!' })
  @ApiProperty()
  bep: boolean;

  @IsNotEmpty({ message: 'do_xe không được bỏ trống!' })
  @ApiProperty()
  do_xe: boolean;

  @IsNotEmpty({ message: 'ho_boi không được bỏ trống!' })
  @ApiProperty()
  ho_boi: boolean;

  @IsNotEmpty({ message: 'ban_ui không được bỏ trống!' })
  @ApiProperty()
  ban_ui: boolean;

  @IsNotEmpty({ message: 'ma_vi_tri không được bỏ trống!' })
  @ApiProperty()
  ma_vi_tri: number;

  @ApiProperty()
  hinh_anh: string;
}
