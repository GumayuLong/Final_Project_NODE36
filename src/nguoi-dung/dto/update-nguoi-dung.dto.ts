import { PartialType } from '@nestjs/mapped-types';
import { CreateNguoiDungDto } from './create-nguoi-dung.dto';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateNguoiDungDto extends PartialType(CreateNguoiDungDto) {
  @IsNotEmpty({ message: 'full_name không được bỏ trống!' })
  @ApiProperty()
  full_name: string;

  // @IsNotEmpty({ message: 'pass_word không được bỏ trống!' })
  // @ApiProperty()
  // pass_word: string;

  @IsNotEmpty({ message: 'phone không được bỏ trống!' })
  @ApiProperty()
  phone: string;

  @IsNotEmpty({ message: 'birth_day không được bỏ trống!' })
  @ApiProperty()
  birth_day: string;

  @IsNotEmpty({ message: 'gender không được bỏ trống!' })
  @ApiProperty()
  gender: string;

  @IsNotEmpty({ message: 'role không được bỏ trống!' })
  @ApiProperty()
  role: string;
}
