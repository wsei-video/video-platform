import fs from 'fs/promises';
import { Readable } from 'stream';

import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import {
  CreateBucketCommand,
  GetObjectCommand,
  HeadBucketCommand,
  PutObjectCommand,
  S3Client,
  S3ClientConfig,
  S3ServiceException,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { Config } from '../config';
import { StorageConstants } from './storage.constants';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly client: S3Client;

  public readonly clientConfig: S3ClientConfig;

  public constructor(config: Config) {
    this.clientConfig = {
      region: StorageConstants.region,
      endpoint: `http://${config.minio.host}:${config.minio.port}`,
      credentials: {
        accessKeyId: config.minio.accessKey,
        secretAccessKey: config.minio.secretKey,
      },
      forcePathStyle: true,
    };
    this.client = new S3Client(this.clientConfig);
  }

  public async createBucketIfNotExists(bucket: string): Promise<void> {
    const bucketExists = await this.bucketExists(bucket);
    if (bucketExists) return this.logger.log(`Bucket "${bucket}" exists.`);

    this.logger.log(`Creating bucket "${bucket}"...`);
    await this.client.send(new CreateBucketCommand({ Bucket: bucket }));
    this.logger.log(`Bucket "${bucket}" has been created.`);
  }

  public async bucketExists(bucket: string): Promise<boolean> {
    try {
      await this.client.send(new HeadBucketCommand({ Bucket: bucket }));
      return true;
    } catch (error: unknown) {
      if (error instanceof S3ServiceException) {
        if (error.name === 'NotFound' || error.$metadata?.httpStatusCode === HttpStatus.NOT_FOUND) {
          return false;
        }
      }
      throw error;
    }
  }

  public async getDownloadUrl(bucket: string, key: string, expiresIn = 3600): Promise<string> {
    const command = new GetObjectCommand({ Bucket: bucket, Key: key });
    return await getSignedUrl(this.client, command, { expiresIn });
  }

  public async getObject(bucket: string, key: string, range?: string): Promise<StorageObject | null> {
    const command = new GetObjectCommand({ Bucket: bucket, Key: key, Range: range });

    try {
      const result = await this.client.send(command);
      const body = result.Body;
      if (!(body instanceof Readable)) return null;

      const headers = {
        'Content-Type': result.ContentType,
        'Content-Length': result.ContentLength?.toString(),
        'Content-Range': result.ContentRange,
        'Accept-Ranges': result.AcceptRanges,
      };

      return {
        headers,
        body,
      };
    } catch (error: unknown) {
      if (error instanceof S3ServiceException) {
        if (error.name === 'NoSuchKey' || error.name === 'NoSuchBucket') return null;
      }
      throw error;
    }
  }

  public async upload(bucket: string, key: string, file: string | Uint8Array | Buffer | Readable): Promise<void> {
    await this.client.send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: file }));
  }

  public async uploadLocalFile(bucket: string, key: string, filepath: string): Promise<void> {
    await this.upload(bucket, key, await fs.readFile(filepath));
  }
}

export interface StorageObject {
  headers: Record<string, string | undefined>;
  body: Readable;
}
