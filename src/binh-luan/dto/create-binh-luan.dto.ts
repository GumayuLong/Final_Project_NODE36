import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateBinhLuanDto {
  @IsNotEmpty({ message: 'ma_phong không được bỏ trống!' })
  @ApiProperty()
  ma_phong: number;

  @IsNotEmpty({ message: 'ma_nguoi_binh_luan không được bỏ trống!' })
  @ApiProperty()
  ma_nguoi_binh_luan: number;

  @IsNotEmpty({ message: 'ngay_binh_luan không được bỏ trống!' })
  @ApiProperty()
  ngay_binh_luan: Date;

  @IsNotEmpty({ message: 'noi_dung không được bỏ trống!' })
  @ApiProperty()
  noi_dung: string;

  @IsNotEmpty({ message: 'sao_binh_luan không được bỏ trống!' })
  @ApiProperty()
  sao_binh_luan: number;
}
