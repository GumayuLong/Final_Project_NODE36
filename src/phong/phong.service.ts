import { Injectable, UploadedFiles } from '@nestjs/common';
import { CreatePhongDto } from './dto/create-phong.dto';
import { UpdatePhongDto } from './dto/update-phong.dto';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import {
  PutObjectCommand,
  S3Client,
  PutObjectCommandInput,
  PutObjectCommandOutput,
} from '@aws-sdk/client-s3';

@Injectable()
export class PhongService {
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

  async fetchPhongThueApi(res): Promise<any> {
    try {
      let data = await this.prisma.phong.findMany();
      return res.status(200).send(data);
    } catch {
      return res.status(500).send('Lỗi BE!');
    }
  }

  async createPhongThueApi(body: CreatePhongDto, res): Promise<any> {
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

      let checkMaViTri = await this.prisma.vi_tri.findFirst({
        where: {
          id: ma_vi_tri,
        },
      });
      if (checkMaViTri) {
        let createPhong = await this.prisma.phong.create({
          data: newPhongThue,
        });

        return res.status(201).send(createPhong);
      } else {
        return res.status(404).send('Mã vị trí không tồn tại!');
      }
    } catch {
      return res.status(500).send('Lỗi BE!');
    }
  }

  async getPhongBaseOneLocationApi(maViTri, res): Promise<any> {
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
          return res.status(200).send(data);
        } else {
          return res.status(404).send('Vị trí này chưa có phòng!');
        }
      } else {
        return res.status(404).send('Mã vị trí không tổn tại');
      }
    } catch {
      return res.status(500).send('Lỗi BE!');
    }
  }

  async getPhongBaseOnIdApi(idPhong, res): Promise<any> {
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
        return res.status(200).send(data);
      } else {
        return res.status(404).send('Mã phòng không tồn tại!');
      }
    } catch {
      return res.status(500).send('Lỗi BE!');
    }
  }

  async updatePhongThueApi(body: UpdatePhongDto, idPhong, res): Promise<any> {
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
        };
        let update = await this.prisma.phong.update({
          where: {
            id: Number(idPhong),
          },
          data: dataUpdate,
        });
        return res.status(201).send(update);
      } else if (!checkIdPhong) {
        return res.status(404).send('Mã phòng không tồn tại!');
      } else if (!checkMaViTri) {
        return res.status(404).send('Mã vị trí không tồn tại!');
      }
    } catch {
      return res.status(500).send('Lỗi BE!');
    }
  }

  async deletePhongThueApi(idPhong, res): Promise<any> {
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
        return res.status(201).send('Xóa phòng thành công');
      } else if (checkBookedRoom) {
        return res
          .status(404)
          .send('Phòng đã được đặt, không thể xóa phòng này!');
      } else if (!checkIdPhong) {
        return res.status(404).send('Mã phòng không tồn tại!');
      }
    } catch {
      return res.status(500).send('Lỗi BE!');
    }
  }

  async phanTrangPhongApi(pageIndex, pageSize, keyword, res): Promise<any> {
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
        return res.status(200).send(data);
      } else if (data.length !== 0 && keyword) {
        return res.status(200).send(findKeyWord);
      } else if (data.length === 0) {
        return res.status(400).send('Không phân được trang!');
      }
    } catch {
      return res.status(500).send('Lỗi BE!');
    }
  }

  async uploadHinhPhongApi(
    maPhong,
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
      let checkMaPhong = await this.prisma.phong.findFirst({
        where: {
          id: Number(maPhong),
        },
      });
      if (checkMaPhong) {
        const response: PutObjectCommandOutput = await this.s3.send(
          new PutObjectCommand(input),
        );
        if (response.$metadata.httpStatusCode === 200) {
          const url = `http://${bucket}.s3.${this.region}.amazonaws.com/${key}`;
          let data = await this.prisma.phong.findFirst({
            where: {
              id: Number(maPhong),
            },
          });
          let newHinh = { ...data, hinh_anh: url };
          let upload = await this.prisma.phong.update({
            where: {
              id: Number(maPhong),
            },
            data: newHinh,
          });
          return res.status(201).send(upload);
        }
      } else {
        return res.status(404).send('Mã phòng không tồn tại');
      }
    } catch {
      return res.status(500).send('Không tìm thấy tài nguyên!');
    }
  }
}
