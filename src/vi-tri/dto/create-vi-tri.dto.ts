import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateViTriDto {
  @IsNotEmpty({ message: 'ten_vi_tri không được bỏ trống' })
  @ApiProperty()
  ten_vi_tri: string;

  @IsNotEmpty({ message: 'tinh_thanh không được bỏ trống' })
  @ApiProperty()
  tinh_thanh: string;

  @IsNotEmpty({ message: 'quoc_gia không được bỏ trống' })
  @ApiProperty()
  quoc_gia: string;
}
