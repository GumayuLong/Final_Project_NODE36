import { Injectable } from '@nestjs/common';
import { CreateViTriDto } from './dto/create-vi-tri.dto';
import { UpdateViTriDto } from './dto/update-vi-tri.dto';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import {
  PutObjectCommand,
  S3Client,
  PutObjectCommandInput,
  PutObjectCommandOutput,
} from '@aws-sdk/client-s3';

@Injectable()
export class ViTriService {
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

  async fetchViTriApi(res): Promise<any> {
    try {
      let data = await this.prisma.vi_tri.findMany();
      return res.status(200).send(data);
    } catch {
      return res.status(500).send('Lỗi BE!');
    }
  }

  async createViTriApi(body: CreateViTriDto, res): Promise<any> {
    try {
      let { ten_vi_tri, tinh_thanh, quoc_gia } = body;
      let data = { ten_vi_tri, tinh_thanh, quoc_gia };
      let newData = await this.prisma.vi_tri.create({
        data: data,
      });
      return res.status(201).send(newData);
    } catch {
      return res.status(400).send('Không tìm thấy tài nguyên!');
    }
  }

  async getInfoLocationBaseOnId(idViTri, res): Promise<any> {
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
        return res.status(200).send(data);
      } else {
        return res.status(404).send('Mã vị trí không tồn tại!');
      }
    } catch {
      return res.status(500).send('Lỗi BE!');
    }
  }

  async updateLocationApi(body: UpdateViTriDto, idViTri, res): Promise<any> {
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
        return res.status(201).send(updateData);
      } else {
        return res.status(404).send('Mã vị trí không tồn tại!');
      }
    } catch {
      return res.status(500).send('Lỗi BE!');
    }
  }

  async deleteLocationApi(idViTri, res): Promise<any> {
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
        return res.status(201).send('Xóa vị trí thành công');
      } else if (!checkIdViTri) {
        return res.status(404).send('Mã vị trí không tồn tại!');
      } else if (checkViTriPhong) {
        return res
          .status(400)
          .send('Vị trí đã được dùng trong table phong, không thể xóa!');
      }
    } catch {
      return res.status(500).send('Lỗi BE!');
    }
  }

  async phanTrangViTriApi(pageIndex, pageSize, keyword, res): Promise<any> {
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
        return res.status(201).send(data);
      } else if (data.length !== 0 && keyword) {
        return res.status(201).send(findKeyWord);
      } else if (data.length === 0) {
        return res.status(400).send('Không phân được trang!');
      }
    } catch {
      return res.status(500).send('Lỗi BE!');
    }
  }

  async uploadHinhViTriApi(
    maViTri,
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
      let checkMaViTri = await this.prisma.vi_tri.findFirst({
        where: {
          id: Number(maViTri),
        },
      });
      if (checkMaViTri) {
        const response: PutObjectCommandOutput = await this.s3.send(
          new PutObjectCommand(input),
        );
        if (response.$metadata.httpStatusCode === 200) {
          const url = `http://${bucket}.s3.${this.region}.amazonaws.com/${key}`;
          let data = await this.prisma.vi_tri.findFirst({
            where: {
              id: Number(maViTri),
            },
          });
          let newHinh = { ...data, hinh_anh: url };
          let upload = await this.prisma.vi_tri.update({
            where: {
              id: Number(maViTri),
            },
            data: newHinh,
          });
          return res.status(201).send(upload);
        }
      } else {
        return res.status(404).send('Mã vị trí không tồn tại');
      }
    } catch {
      return res.status(500).send('Không tìm thấy tài nguyên!');
    }
  }

  async createUploadHinhVitri(
    maViTri,
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
      let checkMaViTri = await this.prisma.vi_tri.findFirst({
        where: {
          id: Number(maViTri),
        },
      });
      if (checkMaViTri) {
        const response: PutObjectCommandOutput = await this.s3.send(
          new PutObjectCommand(input),
        );
        if (response.$metadata.httpStatusCode === 200) {
          const url = `http://${bucket}.s3.${this.region}.amazonaws.com/${key}`;
          let data = await this.prisma.vi_tri.findFirst({
            where: {
              id: Number(maViTri),
            },
          });
          let newHinh = { ...data, hinh_anh: url };
          let upload = await this.prisma.vi_tri.update({
            where: {
              id: Number(maViTri),
            },
            data: newHinh,
          });
          return res.status(201).send(upload);
        }
      } else {
        return res.status(404).send('Mã vị trí không tồn tại');
      }
    } catch {
      return res.status(500).send('Không tìm thấy tài nguyên!');
    }
  }
}
