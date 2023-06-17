import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthService } from 'src/auth/auth.service';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaService } from 'src/PrismaService';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/auth/jwt-stategy';
import { LocalStrategy } from 'src/auth/local.strategy';
import { S3Service } from 'src/s3Service';

@Module({
  imports: [
    AuthModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '6000s' },
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    AuthService,
    PrismaService,
    JwtStrategy,
    LocalStrategy,
    S3Service,
  ],
})
export class UserModule {}
