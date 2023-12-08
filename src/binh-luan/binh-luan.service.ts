import { Body, Injectable } from '@nestjs/common';
import { CreateBinhLuanDto } from './dto/create-binh-luan.dto';
import { UpdateBinhLuanDto } from './dto/update-binh-luan.dto';
import { PrismaClient } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BinhLuanService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  prisma = new PrismaClient();

  async fetchBinhLuanApi(): Promise<any> {
    try {
      let data = await this.prisma.binh_luan.findMany();
      return data;
    } catch {
      return 'Lỗi BE!';
    }
  }

  // async createBinhLuanApi(
  //   body: CreateBinhLuanDto,
  //   token: string,
  // ): Promise<any> {
  //   let decode = await this.jwtService.verify(token.slice(7), {
  //     secret: this.configService.get('SECRET_KEY'),
  //   });
  //   let { ma_phong, ngay_binh_luan, noi_dung, sao_binh_luan } = body;

  //   let data = {
  //     ma_phong,
  //     ma_nguoi_binh_luan: decode.data.id,
  //     ngay_binh_luan,
  //     noi_dung,
  //     sao_binh_luan,
  //   };

  //   let newBinhLuan = await this.prisma.binh_luan.create({
  //     data: data,
  //   });
  //   return newBinhLuan;
  // }

  async createBinhLuanApi(body: CreateBinhLuanDto): Promise<any> {
    try {
      let {
        ma_phong,
        ma_nguoi_binh_luan,
        ngay_binh_luan,
        noi_dung,
        sao_binh_luan,
      } = body;

      let checkMaPhong = await this.prisma.phong.findFirst({
        where: {
          id: ma_phong,
        },
      });

      let checkMaNguoiBinhLuan = await this.prisma.nguoi_dung.findFirst({
        where: {
          id: ma_nguoi_binh_luan,
        },
      });

      if (checkMaPhong && checkMaNguoiBinhLuan) {
        let data = {
          ma_phong,
          ma_nguoi_binh_luan,
          ngay_binh_luan,
          noi_dung,
          sao_binh_luan,
        };

        let newBinhLuan = await this.prisma.binh_luan.create({
          data: data,
        });
        return newBinhLuan;
      } else if (!checkMaPhong) {
        return 'Mã phòng không tồn tại!';
      } else if (!checkMaNguoiBinhLuan) {
        return 'Mã người dùng không tồn tại!';
      }
    } catch {
      return 'Lỗi BE!';
    }
  }

  async updateBinhLuan(body: UpdateBinhLuanDto, idBinhLuan): Promise<any> {
    try {
      let {
        ma_phong,
        ma_nguoi_binh_luan,
        ngay_binh_luan,
        noi_dung,
        sao_binh_luan,
      } = body;

      let checkId = await this.prisma.binh_luan.findFirst({
        where: {
          id: Number(idBinhLuan),
        },
      });

      let checkMaPhong = await this.prisma.phong.findFirst({
        where: {
          id: ma_phong,
        },
      });

      let checkMaNguoiBinhLuan = await this.prisma.nguoi_dung.findFirst({
        where: {
          id: ma_nguoi_binh_luan,
        },
      });

      if (checkMaPhong && checkMaNguoiBinhLuan && checkId) {
        let updateData = {
          id: Number(idBinhLuan),
          ma_phong,
          ma_nguoi_binh_luan,
          ngay_binh_luan,
          noi_dung,
          sao_binh_luan,
        };

        let updateBinhLuan = await this.prisma.binh_luan.update({
          where: {
            id: Number(idBinhLuan),
          },
          data: updateData,
        });
        return updateBinhLuan;
      } else if (!checkMaPhong) {
        return 'Mã phòng không tồn tại!';
      } else if (!checkMaNguoiBinhLuan) {
        return 'Mã người dùng không tồn tại!';
      } else if (!checkId) {
        return 'Mã bình luận không tồn tại!';
      }
    } catch {
      return 'Lỗi BE!';
    }
  }

  async deleteBinhLuanApi(idBinhLuan: number): Promise<any> {
    try {
      let checkId = await this.prisma.binh_luan.findFirst({
        where: {
          id: Number(idBinhLuan),
        },
      });

      if (checkId) {
        await this.prisma.binh_luan.delete({
          where: {
            id: Number(idBinhLuan),
          },
        });
        return 'Xóa bình luận thành công!';
      } else {
        return 'Mã bình luận không tồn tại';
      }
    } catch {
      return 'Lỗi BE!';
    }
  }

  async getInfoBinhLuanTheoMaPhongApi(maPhong: number): Promise<any> {
    try {
      let checkId = await this.prisma.binh_luan.findFirst({
        where: {
          id: Number(maPhong),
        },
      });
      if (checkId) {
        let data = await this.prisma.binh_luan.findMany({
          where: {
            ma_phong: Number(maPhong),
          },
        });
        return data;
      } else {
        return 'Mã phòng không tồn tại!';
      }
    } catch {
      return 'Lỗi BE!';
    }
  }
}
