import { Injectable, UploadedFiles } from '@nestjs/common';
import { CreatePhongDto } from './dto/create-phong.dto';
import { UpdatePhongDto } from './dto/update-phong.dto';
import { PrismaClient } from '@prisma/client';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Injectable()
export class PhongService {
  prisma = new PrismaClient();

  async fetchPhongThueApi(): Promise<any> {
    try {
      let data = await this.prisma.phong.findMany();
      return data;
    } catch {
      return 'Lỗi BE!';
    }
  }

  async createPhongThueApi(body: CreatePhongDto): Promise<any> {
    try {
      let {
        ten_phong,
        khach,
        phong_ngu,
        giuong,
        phong_tam,
        mo_ta,
        gia_tien,
        may_giat,
        ban_la,
        tivi,
        dieu_hoa,
        wifi,
        bep,
        do_xe,
        ho_boi,
        ban_ui,
        ma_vi_tri,
        hinh_anh,
      } = body;

      let newPhongThue = {
        ten_phong,
        khach,
        phong_ngu,
        giuong,
        phong_tam,
        mo_ta,
        gia_tien,
        may_giat,
        ban_la,
        tivi,
        dieu_hoa,
        wifi,
        bep,
        do_xe,
        ho_boi,
        ban_ui,
        ma_vi_tri,
        hinh_anh,
      };

      let createPhong = await this.prisma.phong.create({
        data: newPhongThue,
      });

      return createPhong;
    } catch {
      return 'Lỗi BE!';
    }
  }

  async getPhongBaseOneLocationApi(maViTri): Promise<any> {
    try {
      let checkMaViTri = await this.prisma.vi_tri.findFirst({
        where: {
          id: Number(maViTri),
        },
      });

      if (checkMaViTri) {
        let data = await this.prisma.phong.findMany({
          where: {
            ma_vi_tri: Number(maViTri),
          },
        });
        if (data.length !== 0) {
          return data;
        } else {
          return 'Vị trí này chưa có phòng!';
        }
      } else {
        return 'Mã vị trí không tổn tại';
      }
    } catch {
      return 'Lỗi BE!';
    }
  }

  async getPhongBaseOnIdApi(idPhong): Promise<any> {
    try {
      let checkIdPhong = await this.prisma.phong.findFirst({
        where: {
          id: Number(idPhong),
        },
      });
      if (checkIdPhong) {
        let data = await this.prisma.phong.findFirst({
          where: {
            id: Number(idPhong),
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

  async updatePhongThueApi(body: UpdatePhongDto, idPhong): Promise<any> {
    try {
      let {
        ten_phong,
        khach,
        phong_ngu,
        giuong,
        phong_tam,
        mo_ta,
        gia_tien,
        may_giat,
        ban_la,
        tivi,
        dieu_hoa,
        wifi,
        bep,
        do_xe,
        ho_boi,
        ban_ui,
        ma_vi_tri,
        hinh_anh,
      } = body;
      let checkIdPhong = await this.prisma.phong.findFirst({
        where: {
          id: Number(idPhong),
        },
      });
      let checkMaViTri = await this.prisma.vi_tri.findFirst({
        where: {
          id: ma_vi_tri,
        },
      });
      if (checkIdPhong && checkMaViTri) {
        let dataUpdate = {
          ten_phong,
          khach,
          phong_ngu,
          giuong,
          phong_tam,
          mo_ta,
          gia_tien,
          may_giat,
          ban_la,
          tivi,
          dieu_hoa,
          wifi,
          bep,
          do_xe,
          ho_boi,
          ban_ui,
          ma_vi_tri,
          hinh_anh,
        };
        let update = await this.prisma.phong.update({
          where: {
            id: Number(idPhong),
          },
          data: dataUpdate,
        });
        return update;
      } else if (!checkIdPhong) {
        return 'Mã phòng không tồn tại!';
      } else if (!checkMaViTri) {
        return 'Mã vị trí không tồn tại!';
      }
    } catch {
      return 'Lỗi BE!';
    }
  }

  async deletePhongThueApi(idPhong): Promise<any> {
    try {
      let checkIdPhong = await this.prisma.phong.findFirst({
        where: {
          id: Number(idPhong),
        },
      });
      let checkBookedRoom = await this.prisma.dat_phong.findFirst({
        where: {
          ma_phong: Number(idPhong),
        },
      });
      if (checkIdPhong && !checkBookedRoom) {
        await this.prisma.phong.delete({
          where: {
            id: Number(idPhong),
          },
        });
        return 'Xóa phòng thành công';
      } else if (checkBookedRoom) {
        return 'Phòng đã được đặt, không thể xóa phòng này!';
      } else if (!checkIdPhong) {
        return 'Mã phòng không tồn tại!';
      }
    } catch {
      return 'Lỗi BE!';
    }
  }

  async phanTrangPhongApi(pageIndex, pageSize, keyword): Promise<any> {
    try {
      let data = await this.prisma.phong.findMany({
        skip: (Number(pageIndex) - 1) * Number(pageSize),
        take: Number(pageSize),
      });
      let findKeyWord = await this.prisma.phong.findMany({
        where: {
          ten_phong: {
            contains: keyword,
          },
        },
      });
      if (data.length !== 0 && !keyword) {
        return data;
      } else if (data.length !== 0 && keyword) {
        return findKeyWord;
      } else if (data.length === 0) {
        return 'Không phân được trang!';
      }
    } catch {
      return 'Lỗi BE!';
    }
  }

  async uploadHinhPhongApi(maPhong, file): Promise<any> {
    try {
      let checkMaPhong = await this.prisma.phong.findFirst({
        where: {
          id: Number(maPhong),
        },
      });
      if (checkMaPhong) {
        let data = await this.prisma.phong.findFirst({
          where: {
            id: Number(maPhong),
          },
        });
        let newHinh = { ...data, hinh_anh: file.filename };
        let upload = await this.prisma.phong.update({
          where: {
            id: Number(maPhong),
          },
          data: newHinh,
        });
        return upload;
      } else {
        return 'Mã phòng không tồn tại';
      }
    } catch {
      return 'Lỗi BE!';
    }
  }
}
