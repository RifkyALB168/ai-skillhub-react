import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';

@Injectable()
export class SkillsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateSkillDto) {
    try {
      return await this.prisma.skill.create({
        data: { ...dto, normalizedName: dto.name.toLowerCase() },
      });
    } catch (error) {
      this.rethrowWriteError(error);
    }
  }

  findAll() {
    return this.prisma.skill.findMany({ orderBy: { id: 'asc' } });
  }

  async findOne(id: number) {
    this.validateId(id);
    const skill = await this.prisma.skill.findUnique({ where: { id } });
    if (!skill) throw this.notFound(id);
    return skill;
  }

  async update(id: number, dto: UpdateSkillDto) {
    this.validateId(id);
    try {
      return await this.prisma.skill.update({
        where: { id },
        data: { ...dto, normalizedName: dto.name?.toLowerCase() },
      });
    } catch (error) {
      this.rethrowWriteError(error, id);
    }
  }

  async remove(id: number) {
    this.validateId(id);
    try {
      return await this.prisma.skill.delete({ where: { id } });
    } catch (error) {
      this.rethrowWriteError(error, id);
    }
  }

  private validateId(id: number) {
    if (id < 1 || id > 2_147_483_647) throw this.notFound(id);
  }

  private notFound(id: number) {
    return new NotFoundException('Skill dengan ID ' + id + ' tidak ditemukan.');
  }

  private rethrowWriteError(error: unknown, id?: number): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new ConflictException('Nama skill sudah digunakan.');
      }
      if (error.code === 'P2025' && id !== undefined) throw this.notFound(id);
    }
    throw error;
  }
}
