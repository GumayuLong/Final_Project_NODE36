import { ApiProperty } from '@nestjs/swagger';

export class UpLoadHinhViTriDto {
  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
  formFile: any[];
}
