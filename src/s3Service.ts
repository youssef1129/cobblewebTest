/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({ path: '.env' });

@Injectable()
export class S3Service {
  private readonly s3: AWS.S3;

  constructor() {
    AWS.config.update({
      accessKeyId: process.env.accessKeyId,
      secretAccessKey: process.env.secretAccessKey,
      region: process.env.region,
    });

    this.s3 = new AWS.S3();
  }

  async uploadPhotoToS3(photoData): Promise<string> {
    const params: AWS.S3.PutObjectRequest = {
      Bucket: 'cw-recruitment-tests',
      Key: photoData.name,
      Body: photoData.data,
    };

    const uploadResult = await this.s3.upload(params).promise();
    return uploadResult.Location;
  }
}
