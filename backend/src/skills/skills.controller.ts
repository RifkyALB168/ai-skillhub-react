import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { SkillsService } from './skills.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { Skill } from './entities/skill.entity';

@ApiTags('skills')
@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Post()
  @ApiOperation({ summary: 'Tambah skill' })
  @ApiCreatedResponse({ type: Skill })
  @ApiBadRequestResponse({ description: 'Data tidak valid' })
  @ApiConflictResponse({ description: 'Nama skill duplikat' })
  create(@Body() dto: CreateSkillDto) {
    return this.skillsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Daftar semua skill' })
  @ApiOkResponse({ type: [Skill] })
  findAll() {
    return this.skillsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detail skill' })
  @ApiOkResponse({ type: Skill })
  @ApiNotFoundResponse({ description: 'Skill tidak ditemukan' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.skillsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Ubah skill' })
  @ApiOkResponse({ type: Skill })
  @ApiBadRequestResponse({ description: 'Data tidak valid' })
  @ApiConflictResponse({ description: 'Nama skill duplikat' })
  @ApiNotFoundResponse({ description: 'Skill tidak ditemukan' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateSkillDto) {
    return this.skillsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Hapus skill' })
  @ApiOkResponse({ type: Skill })
  @ApiNotFoundResponse({ description: 'Skill tidak ditemukan' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.skillsService.remove(id);
  }
}
