import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import { ListQuery } from '@video/lib/restful';

export class SearchQuery extends ListQuery {
  @ApiProperty({ description: 'Content search phrase' })
  @IsString()
  public readonly phrase: string;
}
