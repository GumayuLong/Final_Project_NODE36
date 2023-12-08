import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { NguoiDungModule } from './nguoi-dung/nguoi-dung.module';
import { DatPhongModule } from './dat-phong/dat-phong.module';
import { BinhLuanModule } from './binh-luan/binh-luan.module';
import { PhongModule } from './phong/phong.module';
import { ViTriModule } from './vi-tri/vi-tri.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    NguoiDungModule,
    DatPhongModule,
    BinhLuanModule,
    PhongModule,
    ViTriModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
