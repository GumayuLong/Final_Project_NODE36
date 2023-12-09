import { PartialType } from '@nestjs/mapped-types';
import { CreateViTriDto } from './create-vi-tri.dto';
import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateViTriDto extends PartialType(CreateViTriDto) {
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
