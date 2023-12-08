import { Injectable } from '@nestjs/common';
import { CreateDatPhongDto } from './dto/create-dat-phong.dto';
import { UpdateDatPhongDto } from './dto/update-dat-phong.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class DatPhongService {
  prisma = new PrismaClient();
  async fetchDatPhongApi(): Promise<any> {
    try {
      let data = await this.prisma.dat_phong.findMany({});
      return data;
    } catch {
      return 'Lỗi BE!';
    }
  }

  async createDatPhongApi(body: CreateDatPhongDto): Promise<any> {
    try {
      let { ma_phong, ngay_den, ngay_di, so_luong_khach, ma_nguoi_dat } = body;
      let checkMaPhong = await this.prisma.phong.findFirst({
        where: {
          id: ma_phong,
        },
      });
      let checkMaNguoiDat = await this.prisma.nguoi_dung.findFirst({
        where: {
          id: ma_nguoi_dat,
        },
      });
      if (checkMaPhong && checkMaNguoiDat) {
        let newDatPhong = {
          ma_phong,
          ngay_den,
          ngay_di,
          so_luong_khach,
          ma_nguoi_dat,
        };
        let datPhong = await this.prisma.dat_phong.create({
          data: newDatPhong,
        });
        return datPhong;
      } else if (!checkMaPhong) {
        return 'Mã phòng không tồn tại!';
      } else if (!checkMaNguoiDat) {
        return 'Mã người dùng không tồn tại!';
      }
    } catch {
      return 'Lỗi BE!';
    }
  }

  async getInfoDatPhongTheoIdApi(idDatPhong): Promise<any> {
    try {
      let checkMaDatPhong = await this.prisma.dat_phong.findFirst({
        where: {
          id: Number(idDatPhong),
        },
      });
      if (checkMaDatPhong) {
        let findInfoDatPhongBaseOnId = await this.prisma.dat_phong.findFirst({
          where: {
            id: Number(idDatPhong),
          },
        });
        return findInfoDatPhongBaseOnId;
      } else {
        return 'Mã đặt phòng không tồn tại!';
      }
    } catch {
      return 'Lỗi BE!';
    }
  }

  async updateDatPhongApi(body, idDatPhong): Promise<any> {
    try {
      let { ma_phong, ngay_den, ngay_di, so_luong_khach, ma_nguoi_dat } = body;
      let checkMaPhong = await this.prisma.phong.findFirst({
        where: {
          id: ma_phong,
        },
      });
      let checkMaNguoiDat = await this.prisma.nguoi_dung.findFirst({
        where: {
          id: ma_nguoi_dat,
        },
      });
      let checkMaDatPhong = await this.prisma.dat_phong.findFirst({
        where: {
          id: Number(idDatPhong),
        },
      });
      if (checkMaDatPhong && checkMaNguoiDat && checkMaPhong) {
        let updateData = {
          ma_phong,
          ngay_den,
          ngay_di,
          so_luong_khach,
          ma_nguoi_dat,
        };
        let update = this.prisma.dat_phong.update({
          where: {
            id: Number(idDatPhong),
          },
          data: updateData,
        });
        return update;
      } else if (!checkMaDatPhong) {
        return 'Mã đặt phòng không tồn tại!';
      } else if (!checkMaNguoiDat) {
        return 'Mã người dùng không tồn tại!';
      } else if (!checkMaPhong) {
        return 'Mã phòng không tồn tại!';
      }
    } catch {
      return 'Lỗi BE!';
    }
  }

  async deleteDatPhongApi(idDatPhong): Promise<any> {
    try {
      let checkMaDatPhong = await this.prisma.dat_phong.findFirst({
        where: {
          id: Number(idDatPhong),
        },
      });
      if (checkMaDatPhong) {
        let deleteDatPhong = await this.prisma.dat_phong.delete({
          where: {
            id: Number(idDatPhong),
          },
        });
        return 'Xóa thông tin đặt phòng thành công!';
      } else {
        return 'Mã đặt phòng không tồn tại!';
      }
    } catch {
      return 'Lỗi BE!';
    }
  }

  async getInfoDatPhongBaseOnNguoiDung(maNguoiDung): Promise<any> {
    try {
      let checkMaNguoiDung = await this.prisma.nguoi_dung.findFirst({
        where: {
          id: Number(maNguoiDung),
        },
      });
      if (checkMaNguoiDung) {
        let getInfo = await this.prisma.dat_phong.findMany({
          where: {
            ma_nguoi_dat: Number(maNguoiDung),
          },
        });
        return getInfo;
      } else {
        return 'Mã người dùng không tồn tại!';
      }
    } catch {
      return 'Lỗi BE!';
    }
  }
}
