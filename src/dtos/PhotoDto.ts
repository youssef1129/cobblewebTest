/* eslint-disable prettier/prettier */
import { IsString } from 'class-validator';

export class CreatePhotoDto {
  @IsString()
  name: string;
  @IsString()
  url: string;
}
