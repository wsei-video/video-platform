import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export abstract class PagedResponse<TItem> {
  @ApiProperty()
  @Expose()
  public total: number;

  @ApiProperty()
  @Expose()
  public next: boolean;

  @ApiProperty()
  @Expose()
  public abstract items: TItem[];
}

export class ListQuery {
  @ApiPropertyOptional({ default: 1 })
  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  public page: number = 1;

  @ApiPropertyOptional({ default: 20 })
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  @Type(() => Number)
  public count: number = 20;
}
