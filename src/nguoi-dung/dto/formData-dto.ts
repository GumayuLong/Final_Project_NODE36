import { ApiProperty } from '@nestjs/swagger';
import { File } from 'buffer';
import { IsNotEmpty } from 'class-validator';

export class FileUploadDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  @IsNotEmpty()
  formFile: any;
}
