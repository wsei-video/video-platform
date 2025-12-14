import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export abstract class PagedResponse<TItem> {
  @ApiProperty({ description: 'The total number of available resources' })
  @Expose()
  public total: number;

  @ApiProperty({ description: 'Whether the next page is available' })
  @Expose()
  public next: boolean;

  @ApiProperty()
  @Expose()
  public abstract items: TItem[];
}

export class ListQuery {
  @ApiPropertyOptional({ default: 1, description: 'Page number' })
  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  public page: number = 1;

  @ApiPropertyOptional({ default: 20, description: 'Maximum number of resources per page' })
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  @Type(() => Number)
  public count: number = 20;
}
