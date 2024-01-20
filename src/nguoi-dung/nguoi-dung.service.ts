import { Injectable } from '@nestjs/common';
import { CreateNguoiDungDto } from './dto/create-nguoi-dung.dto';
import { UpdateNguoiDungDto } from './dto/update-nguoi-dung.dto';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import {
  PutObjectCommand,
  S3Client,
  PutObjectCommandInput,
  PutObjectCommandOutput,
} from '@aws-sdk/client-s3';

@Injectable()
export class NguoiDungService {
  private region: string;
  private s3: S3Client;
  constructor(private readonly configService: ConfigService) {
    this.region =
      this.configService.get<string>('AWS_S3_REGION') || 'ap-southeast-1';
    this.s3 = new S3Client({
      region: this.region,
    });
  }
  prisma = new PrismaClient();
  async fetchNguoiDungApi(res): Promise<any> {
    try {
      let getData = await this.prisma.nguoi_dung.findMany();
      return res.status(200).send(getData);
    } catch {
      return res.status(400).send('Không lấy được dữ liệu người dùng!');
    }
  }

  async createNguoiDungApi(body: CreateNguoiDungDto, res): Promise<any> {
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
        return res.status(201).send(createNguoiDung);
      } else {
        return res.status(400).send('Email đã tồn tại!');
      }
    } catch {
      return res.status(500).send('Lỗi BE!');
    }
  }

  async deleteNguoiDungApi(id, res): Promise<any> {
    try {
      let checkMail = await this.prisma.nguoi_dung.findFirst({
        where: {
          id: Number(id),
        },
      });
      let checkDatPhong = await this.prisma.dat_phong.findFirst({
        where: {
          ma_nguoi_dat: Number(id),
        },
      });
      if (checkMail && !checkDatPhong) {
        let deleteUser = await this.prisma.nguoi_dung.delete({
          where: {
            id: Number(id),
          },
        });
        return res.status(200).send('Xóa người dùng thành công');
      } else if (!checkMail) {
        return res.status(404).send('Người dùng không tồn tại!');
      } else if (checkDatPhong) {
        return res
          .status(404)
          .send('Người dùng này đã đặt phòng, không thể xóa!');
      }
    } catch {
      return res.status(500).send('Lỗi BE!');
    }
  }

  async getInfoNguoiDungTheoIdApi(id, res): Promise<any> {
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
        return res.status(200).send(getData);
      } else {
        return res.status(400).send('Mã người dùng không tồn tại!');
      }
    } catch {
      return res.status(500).send('Lỗi BE!');
    }
  }

  async updateNguoiDungApi(body: UpdateNguoiDungDto, id, res): Promise<any> {
    try {
      let { full_name, phone, birth_day, gender, role } = body;
      let checkId = await this.prisma.nguoi_dung.findFirst({
        where: {
          id: Number(id),
        },
      });
      if (checkId) {
        // let hashPassword = bcrypt.hashSync(pass_word, 10);
        let newUpdate = {
          full_name,
          // pass_word: hashPassword,
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
        return res.status(201).send(updateData);
      } else if (!checkId) {
        return res.status(404).send('Mã người dùng không tồn tại!');
      }
    } catch {
      return res.status(500).send('Lỗi BE!');
    }
  }

  async searchNguoiDungApi(tenNguoiDung, res): Promise<any> {
    try {
      let data = await this.prisma.nguoi_dung.findMany({
        where: {
          full_name: {
            contains: tenNguoiDung,
          },
        },
      });
      if (data.length !== 0) {
        return res.status(200).send(data);
      } else {
        return res.status(404).send('Người dùng không tồn tại!');
      }
    } catch {
      return res.status(500).send('Lỗi BE!');
    }
  }

  async phanTrangUserApi(pageIndex, pageSize, keyword, res): Promise<any> {
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
        return res.status(200).send(data);
      } else if (keyword) {
        return res.status(200).send(findKey);
      } else {
        return res
          .status(400)
          .send('Không thể phân trang hoặc không có keyword!');
      }
    } catch {
      return res.status(500).send('Lỗi BE!');
    }
  }

  async uploadAvatar(
    userId,
    file: Express.Multer.File,
    key: string,
    res,
  ): Promise<any> {
    const bucket = this.configService.get<string>('AWS_BUCKET_NAME');
    const input: PutObjectCommandInput = {
      Body: file.buffer,
      Bucket: bucket,
      Key: key,
      ContentType: file.mimetype,
      ACL: 'public-read',
    };
    try {
      let checkId = await this.prisma.nguoi_dung.findFirst({
        where: {
          id: Number(userId),
        },
      });
      if (checkId) {
        const response: PutObjectCommandOutput = await this.s3.send(
          new PutObjectCommand(input),
        );
        if (response.$metadata.httpStatusCode === 200) {
          const url = `http://${bucket}.s3.${this.region}.amazonaws.com/${key}`;
          let data = await this.prisma.nguoi_dung.findFirst({
            where: {
              id: Number(userId),
            },
          });
          let newHinh = { ...data, avatar: url };
          let uploadAva = await this.prisma.nguoi_dung.update({
            where: {
              id: Number(userId),
            },
            data: newHinh,
          });
          return res.status(201).send(uploadAva);
        } else {
          return res.status(400).send('Upload avatar failed!');
        }
      } else {
        return res.status(404).send('Mã người dùng không tồn tại!');
      }
    } catch {
      return res.status(400).send('Không tìm thấy tài nguyên!');
    }
  }
}
