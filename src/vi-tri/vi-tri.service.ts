import { Injectable } from '@nestjs/common';
import { CreateViTriDto } from './dto/create-vi-tri.dto';
import { UpdateViTriDto } from './dto/update-vi-tri.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class ViTriService {
  prisma = new PrismaClient();

  async fetchViTriApi(): Promise<any> {
    try {
      let data = await this.prisma.vi_tri.findMany();
      return data;
    } catch {
      return 'Lỗi BE!';
    }
  }

  async createViTriApi(body: CreateViTriDto): Promise<any> {
    try {
      let { ten_vi_tri, tinh_thanh, quoc_gia, hinh_anh } = body;
      let data = { ten_vi_tri, tinh_thanh, quoc_gia, hinh_anh };
      let newData = await this.prisma.vi_tri.create({
        data: data,
      });
      return newData;
    } catch {
      return 'Lỗi BE!';
    }
  }

  async getInfoLocationBaseOnId(idViTri): Promise<any> {
    try {
      let checkIdVitri = await this.prisma.vi_tri.findFirst({
        where: {
          id: Number(idViTri),
        },
      });
      if (checkIdVitri) {
        let data = await this.prisma.vi_tri.findFirst({
          where: {
            id: Number(idViTri),
          },
        });
        return data;
      } else {
        return 'Mã vị trí không tồn tại!';
      }
    } catch {
      return 'Lỗi BE!';
    }
  }

  async updateLocationApi(body: UpdateViTriDto, idViTri): Promise<any> {
    try {
      let { ten_vi_tri, tinh_thanh, quoc_gia } = body;
      let checkIdViTri = await this.prisma.vi_tri.findFirst({
        where: {
          id: Number(idViTri),
        },
      });
      if (checkIdViTri) {
        let newUpdate = { ten_vi_tri, tinh_thanh, quoc_gia };
        let updateData = await this.prisma.vi_tri.update({
          where: {
            id: Number(idViTri),
          },
          data: newUpdate,
        });
        return updateData;
      } else {
        return 'Mã vị trí không tồn tại!';
      }
    } catch {
      return 'Lỗi BE!';
    }
  }

  async deleteLocationApi(idViTri): Promise<any> {
    try {
      let checkIdViTri = await this.prisma.vi_tri.findFirst({
        where: {
          id: Number(idViTri),
        },
      });
      let checkViTriPhong = await this.prisma.phong.findFirst({
        where: {
          ma_vi_tri: Number(idViTri),
        },
      });
      if (checkIdViTri && !checkViTriPhong) {
        let deleteData = await this.prisma.vi_tri.delete({
          where: {
            id: Number(idViTri),
          },
        });
        return 'Xóa vị trí thành công';
      } else if (!checkIdViTri) {
        return 'Mã vị trí không tồn tại!';
      } else if (checkViTriPhong) {
        return 'Vị trí đã được dùng trong table phong, không thể xóa!';
      }
    } catch {
      return 'Lỗi BE!';
    }
  }

  async phanTrangViTriApi(pageIndex, pageSize, keyword): Promise<any> {
    try {
      let data = await this.prisma.vi_tri.findMany({
        skip: (Number(pageIndex) - 1) * Number(pageSize),
        take: Number(pageSize),
      });
      let findKeyWord = await this.prisma.vi_tri.findMany({
        where: {
          ten_vi_tri: {
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

  async uploadHinhViTriApi(maViTri, file): Promise<any> {
    try {
      let checkMaViTri = await this.prisma.vi_tri.findFirst({
        where: {
          id: Number(maViTri),
        },
      });
      if (checkMaViTri) {
        let data = await this.prisma.vi_tri.findFirst({
          where: {
            id: Number(maViTri),
          },
        });
        let newHinh = { ...data, hinh_anh: file.filename };
        let upload = await this.prisma.vi_tri.update({
          where: {
            id: Number(maViTri),
          },
          data: newHinh,
        });
        return upload;
      } else {
        return 'Mã vị trí không tồn tại';
      }
    } catch {
      return 'Lỗi BE!';
    }
  }
}
