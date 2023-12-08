import { Module } from '@nestjs/common';
import { DatPhongService } from './dat-phong.service';
import { DatPhongController } from './dat-phong.controller';
import { JwtStrategy } from 'src/strategy/jwt.strategy';

@Module({
  controllers: [DatPhongController],
  providers: [DatPhongService, JwtStrategy],
})
export class DatPhongModule {}
