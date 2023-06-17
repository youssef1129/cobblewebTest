import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { JwtModule } from '@nestjs/jwt';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({ path: '.env' });

@Module({
  imports: [
    AuthModule,
    UserModule,
    JwtModule.register({ secret: process.env.JWT_SECRET }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
