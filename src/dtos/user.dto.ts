/* eslint-disable prettier/prettier */
import { IsEmail, IsOptional, IsString } from 'class-validator';
import { CreatePhotoDto } from './PhotoDto';

export class userRegisterDto {
  @IsString()
  firstname: string;
  @IsString()
  lastname: string;
  @IsEmail()
  email: string;
  @IsString()
  password: string;
  @IsString()
  role: string;
  @IsString()
  @IsOptional()
  avatar: string;
  photos: Array<CreatePhotoDto>;
}

export class userLoginDto {
  @IsEmail()
  email: string;
  @IsString()
  password: string;
}
