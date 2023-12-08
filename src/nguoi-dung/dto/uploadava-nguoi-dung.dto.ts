import { ApiProperty } from '@nestjs/swagger';

export class UpLoadAvaDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any[];
}
