import { ApiProperty } from '@nestjs/swagger';

export class UpLoadHinhPhongDto {
  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
  formFile: any[];
}
