import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/PrismaService';
import * as bcrypt from 'bcrypt';
import { S3Service } from 'src/s3Service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly s3Service: S3Service,
  ) {}

  async validate(email: string, password: string): Promise<any> {
    const user = await this.prismaService.users.findFirst({
      where: { email: email },
      include: {
        client: {
          include: {
            photo: true,
          },
        },
      },
    });
    if (!user) {
      return null;
    }
    const isMatch = await this.verifyPassword(password, user.password).then(
      (res) => {
        return res;
      },
    );
    if (user && isMatch) {
      const { password, ...result } = user;
      return result;
    }
  }

  async verifyPassword(pass: string, encrypted: string): Promise<boolean> {
    return await bcrypt.compare(pass, encrypted).then((res) => {
      return res;
    });
  }

  async login(user) {
    const u = await this.prismaService.users.findFirst({
      where: { email: user.email },
      include: {
        client: {
          include: {
            photo: true,
          },
        },
      },
    });
    if (u) {
      return {
        access_token: this.jwtService.sign(u),
      };
    }
    return new HttpException('user not found', HttpStatus.NOT_FOUND);
  }

  async register(user) {
    const us = await this.prismaService.users.findFirst({
      where: { email: user.email },
      include: {
        client: {
          include: {
            photo: true,
          },
        },
      },
    });

    if (us) {
      return new HttpException('account already exist', HttpStatus.CONFLICT);
    }

    const hash = await bcrypt.hash(user.password, 10);
    if (!user.images || user.images.length < 4) {
      return new HttpException(
        'please provide more than 4 images',
        HttpStatus.BAD_REQUEST,
      );
    }
    const { images, ...newUser } = user;

    const u = await this.prismaService.users.create({
      data: {
        ...newUser,
        password: hash,
        client: {
          create: {
            avatar:
              user.avatar ||
              'https://avatars0.githubusercontent.com/u/33479836?v=4',
            photo: {
              create: images.map((image) => ({
                name: image.name,
                url: image.url,
              })),
            },
          },
        },
      },
    });
    return { access_token: this.jwtService.sign(u) };
  }

  async uploadToS3(images) {
    const photoData = images.map((image) => ({
      name: image.name,
      data: image.url,
    }));
    const uploadedPhotos = await Promise.all(
      photoData.map((photo) => this.s3Service.uploadPhotoToS3(photo)),
    );
  }
}
