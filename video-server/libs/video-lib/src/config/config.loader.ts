import { AppConfig } from './config.types';

export default (): AppConfig => ({
  database: {
    host: process.env.POSTGRES_HOST ?? '',
    port: parseInt(process.env.POSTGRES_PORT ?? '', 10),
    user: process.env.POSTGRES_USER ?? '',
    password: process.env.POSTGRES_PASSWORD ?? '',
    db: process.env.POSTGRES_DB ?? '',
    url: process.env.POSTGRES_URL ?? '',
  },
  rabbitmq: {
    host: process.env.RABBITMQ_HOST ?? '',
    port: parseInt(process.env.RABBITMQ_PORT ?? '', 10),
    user: process.env.RABBITMQ_USER ?? '',
    password: process.env.RABBITMQ_PASSWORD ?? '',
  },
  redis: {
    host: process.env.REDIS_HOST ?? '',
    port: parseInt(process.env.REDIS_PORT ?? '', 10),
  },
  minio: {
    host: process.env.MINIO_HOST ?? '',
    port: parseInt(process.env.MINIO_PORT ?? '', 10),
    accessKey: process.env.MINIO_ACCESS_KEY ?? '',
    secretKey: process.env.MINIO_SECRET_KEY ?? '',
  },
  video: {
    apiUrl: process.env.VIDEO_API_URL ?? '',
    apiUrlInternal: process.env.VIDEO_API_URL_INTERNAL ?? '',
    cdnUrl: process.env.VIDEO_CDN_URL ?? '',
    uploadUrl: process.env.VIDEO_UPLOAD_URL ?? '',
    webClientUrl: process.env.VIDEO_WEB_CLIENT_URL ?? '',
  },
});
