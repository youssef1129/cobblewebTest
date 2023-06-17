import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaService } from 'src/PrismaService';
import { JwtStrategy } from './jwt-stategy';
import { LocalStrategy } from './local.strategy';
import { S3Service } from 'src/s3Service';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({ path: '.env' });

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '6000s' },
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [
    AuthService,
    PrismaService,
    JwtStrategy,
    LocalStrategy,
    S3Service,
  ],
  exports: [AuthService],
})
export class AuthModule {}
