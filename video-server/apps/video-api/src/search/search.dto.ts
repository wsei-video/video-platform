import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

import { ListQuery } from '@video/lib/restful';

export class SearchQuery extends ListQuery {
  @ApiProperty({ description: 'Content search phrase' })
  @IsString()
  @MinLength(1)
  public readonly phrase: string;
}
