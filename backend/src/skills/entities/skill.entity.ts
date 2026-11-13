import { ApiProperty } from '@nestjs/swagger';

export class Skill {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Code Review Helper' })
  name: string;

  @ApiProperty({ example: 'Meninjau kode dan memberikan saran perbaikan.' })
  description: string;

  @ApiProperty({ example: 'Automation' })
  category: string;

  @ApiProperty({ example: 'Claude' })
  platform: string;

  @ApiProperty({ example: '@rifky' })
  author: string;

  @ApiProperty({ example: 0 })
  favs: number;
}
