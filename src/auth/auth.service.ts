import { Injectable, Res } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { registerAuthDTO } from './dto/register-auth.dto';
import { loginAuthDto } from './dto/login-auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  prisma = new PrismaClient();

  async signIn(body: loginAuthDto, res): Promise<string> {
    let { email, pass_word } = body;
    let checkEmail = await this.prisma.nguoi_dung.findFirst({
      where: {
        email,
      },
    });
    if (checkEmail) {
      let checkPass = bcrypt.compareSync(pass_word, checkEmail.pass_word);
      if (checkPass) {
        let data = {
          id: checkEmail.id,
          email,
          full_name: checkEmail.full_name,
          role: checkEmail.role,
        };
        let token = this.jwtService.sign(
          { data: data },
          {
            expiresIn: this.configService.get('EXPIRES_IN'),
            secret: this.configService.get('SECRET_KEY'),
          },
        );
        return res.status(200).send({ token, data });
      } else {
        return res.status(404).send('Password không hợp lệ!');
      }
    } else {
      return res.status(404).send('Email không đúng!');
    }
  }

  async signUp(body: registerAuthDTO, res): Promise<any> {
    let { full_name, email, pass_word, phone, birth_day, gender, role } = body;
    let checkMail = await this.prisma.nguoi_dung.findFirst({
      where: {
        email,
      },
    });
    if (!checkMail) {
      let hashPassword = bcrypt.hashSync(pass_word, 10);
      let createUser = {
        full_name,
        email,
        pass_word: hashPassword,
        phone,
        birth_day,
        gender,
        role,
      };
      let newUser = await this.prisma.nguoi_dung.create({
        data: createUser,
      });
      return res.status(201).send(newUser);
    } else {
      return res.status(401).send('Email đã tồn tại!');
    }
  }
}
