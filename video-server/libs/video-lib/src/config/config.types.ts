export interface DatabaseConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  db: string;
  url: string;
}

export interface RabbitMQConfig {
  host: string;
  port: number;
  user: string;
  password: string;
}

export interface RedisConfig {
  host: string;
  port: number;
}

export interface MinioConfig {
  host: string;
  port: number;
  accessKey: string;
  secretKey: string;
}

export interface MeiliSearchConfig {
  host: string;
  port: number;
  apiKey: string;
}

export interface VideoConfig {
  webClientUrl: string;
  apiUrl: string;
  apiUrlInternal: string;
  apiInternalKey: string;
  uploadUrl: string;
  cdnUrl: string;
}

export interface AppConfig {
  database: DatabaseConfig;
  rabbitmq: RabbitMQConfig;
  redis: RedisConfig;
  minio: MinioConfig;
  meiliSearch: MeiliSearchConfig;
  video: VideoConfig;
}
