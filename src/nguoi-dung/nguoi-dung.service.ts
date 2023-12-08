import { Injectable } from '@nestjs/common';
import { CreateNguoiDungDto } from './dto/create-nguoi-dung.dto';
import { UpdateNguoiDungDto } from './dto/update-nguoi-dung.dto';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class NguoiDungService {
  prisma = new PrismaClient();
  async fetchNguoiDungApi(): Promise<any> {
    try {
      let getData = await this.prisma.nguoi_dung.findMany();
      return getData;
    } catch {
      return 'Lỗi BE!';
    }
  }

  async createNguoiDungApi(body: CreateNguoiDungDto): Promise<any> {
    try {
      let { full_name, email, pass_word, phone, birth_day, gender, role } =
        body;
      let checkEmail = await this.prisma.nguoi_dung.findFirst({
        where: {
          email,
        },
      });
      if (!checkEmail) {
        let hashPassword = bcrypt.hashSync(pass_word, 10);
        let newData = {
          full_name,
          email,
          pass_word: hashPassword,
          phone,
          birth_day,
          gender,
          role,
        };
        let createNguoiDung = await this.prisma.nguoi_dung.create({
          data: newData,
        });
        return createNguoiDung;
      } else {
        return 'Email đã tồn tại!';
      }
    } catch {
      return 'Lỗi BE!';
    }
  }

  async deleteNguoiDungApi(id): Promise<any> {
    try {
      let checkMail = await this.prisma.nguoi_dung.findFirst({
        where: {
          id: Number(id),
        },
      });
      if (checkMail) {
        let deleteUser = await this.prisma.nguoi_dung.delete({
          where: {
            id: Number(id),
          },
        });
        return 'Xóa người dùng thành công';
      } else {
        return 'Người dùng không tồn tại!';
      }
    } catch {
      return 'Lỗi BE!';
    }
  }

  async getInfoNguoiDungTheoIdApi(id): Promise<any> {
    try {
      let checkId = await this.prisma.nguoi_dung.findFirst({
        where: {
          id: Number(id),
        },
      });
      if (checkId) {
        let getData = await this.prisma.nguoi_dung.findFirst({
          where: {
            id: Number(id),
          },
        });
        return getData;
      } else {
        return 'Mã người dùng không tồn tại!';
      }
    } catch {
      return 'Lỗi BE!';
    }
  }

  async updateNguoiDungApi(body: UpdateNguoiDungDto, id): Promise<any> {
    try {
      let { full_name, pass_word, phone, birth_day, gender, role } = body;
      let checkId = await this.prisma.nguoi_dung.findFirst({
        where: {
          id: Number(id),
        },
      });
      if (checkId) {
        let hashPassword = bcrypt.hashSync(pass_word, 10);
        let newUpdate = {
          full_name,
          pass_word: hashPassword,
          phone,
          birth_day,
          gender,
          role,
        };
        let updateData = await this.prisma.nguoi_dung.update({
          where: {
            id: Number(id),
          },
          data: newUpdate,
        });
        return updateData;
      } else if (!checkId) {
        return 'Mã người dùng không tồn tại!';
      }
    } catch {
      return 'Lỗi BE!';
    }
  }

  async searchNguoiDungApi(tenNguoiDung): Promise<any> {
    try {
      let data = await this.prisma.nguoi_dung.findMany({
        where: {
          full_name: {
            contains: tenNguoiDung,
          },
        },
      });
      if (data.length !== 0) {
        return data;
      } else {
        return 'Người dùng không tổn tại!';
      }
    } catch {
      return 'Lỗi BE!';
    }
  }

  async phanTrangUserApi(pageIndex, pageSize, keyword): Promise<any> {
    try {
      let data = await this.prisma.nguoi_dung.findMany({
        skip: (Number(pageIndex) - 1) * Number(pageSize),
        take: Number(pageSize),
      });
      let findKey = await this.prisma.nguoi_dung.findMany({
        where: {
          full_name: {
            contains: keyword,
          },
        },
      });
      if (data.length !== 0 && !keyword) {
        return data;
      } else if (keyword) {
        return findKey;
      } else {
        return 'Không thể phân trang hoặc không có keyword!';
      }
    } catch {
      return 'Lỗi BE!';
    }
  }

  async uploadAvatar(id, file): Promise<any> {
    try {
      let checkUserId = await this.prisma.nguoi_dung.findFirst({
        where: {
          id: Number(id),
        },
      });
      if (checkUserId) {
        let data = await this.prisma.nguoi_dung.findFirst({
          where: {
            id: Number(id),
          },
        });
        let newHinh = { ...data, avatar: file.filename };
        let upload = await this.prisma.nguoi_dung.update({
          where: {
            id: Number(id),
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
