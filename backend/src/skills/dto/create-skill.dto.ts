import { Transform } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export const CATEGORIES = [
  'Design',
  'Security',
  'Data',
  'Writing',
  'Research',
  'Automation',
];
export const PLATFORMS = ['Claude', 'OpenAI', 'Gemini', 'AI Agent', 'General'];

const trim = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

export class CreateSkillDto {
  @ApiProperty({ example: 'Code Review Helper', minLength: 3, maxLength: 100 })
  @Transform(trim)
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  name: string;

  @ApiProperty({
    example: 'Meninjau kode dan memberikan saran perbaikan.',
    minLength: 10,
    maxLength: 500,
  })
  @Transform(trim)
  @IsString()
  @MinLength(10)
  @MaxLength(500)
  description: string;

  @ApiProperty({ enum: CATEGORIES, example: 'Automation' })
  @IsString()
  @IsIn(CATEGORIES)
  category: string;

  @ApiProperty({ enum: PLATFORMS, example: 'Claude' })
  @IsString()
  @IsIn(PLATFORMS)
  platform: string;

  @ApiProperty({ example: '@rifky', minLength: 2, maxLength: 50 })
  @Transform(trim)
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  author: string;

  @ApiProperty({ example: 0, minimum: 0 })
  @IsInt()
  @Min(0)
  favs: number;
}
