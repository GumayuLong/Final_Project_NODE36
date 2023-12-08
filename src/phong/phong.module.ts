import { Module } from '@nestjs/common';
import { PhongService } from './phong.service';
import { PhongController } from './phong.controller';
import { JwtStrategy } from 'src/strategy/jwt.strategy';

@Module({
  controllers: [PhongController],
  providers: [PhongService, JwtStrategy],
})
export class PhongModule {}
