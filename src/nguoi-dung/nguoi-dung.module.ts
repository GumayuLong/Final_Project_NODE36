import { Module } from '@nestjs/common';
import { NguoiDungService } from './nguoi-dung.service';
import { NguoiDungController } from './nguoi-dung.controller';
import { JwtStrategy } from 'src/strategy/jwt.strategy';

@Module({
  controllers: [NguoiDungController],
  providers: [NguoiDungService, JwtStrategy],
})
export class NguoiDungModule {}
