export interface DatabaseConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  db: string;
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

export interface AppConfig {
  database: DatabaseConfig;
  rabbitmq: RabbitMQConfig;
  redis: RedisConfig;
  minio: MinioConfig;
}
