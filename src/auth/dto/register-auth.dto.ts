import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class registerAuthDTO {
  @IsNotEmpty({ message: 'Họ tên không được bỏ trống!' })
  @ApiProperty()
  full_name: string;

  @IsEmail({}, { message: 'Email không đúng định dạng!' })
  @ApiProperty()
  email: string;

  @IsNotEmpty({ message: 'Password không được bỏ trống!' })
  @ApiProperty()
  pass_word: string;

  @IsNotEmpty({ message: 'Role không được bỏ trống!' })
  @ApiProperty()
  role: string;

  @IsNotEmpty({ message: 'Số điện thoại không được bỏ trống!' })
  @ApiProperty()
  phone: string;

  @IsNotEmpty({ message: 'Ngày sinh không được bỏ trống!' })
  @ApiProperty()
  birth_day: string;

  @IsNotEmpty({ message: 'Giới tính không được bỏ trống!' })
  @ApiProperty()
  gender: string;
}
