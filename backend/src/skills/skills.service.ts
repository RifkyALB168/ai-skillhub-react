import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { Skill } from './entities/skill.entity';

@Injectable()
export class SkillsService {
  private skills: Skill[] = [
    {
      id: 1,
      name: 'UI/UX Designer Assistant',
      description:
        'Memberi masukan layout, warna, dan aksesibilitas dari screenshot desain.',
      category: 'Design',
      platform: 'Claude',
      author: '@design_guru',
      favs: 124,
    },
    {
      id: 2,
      name: 'Python Security Auditor',
      description:
        'Memeriksa kode Python untuk celah keamanan seperti SQL injection dan secret yang bocor.',
      category: 'Security',
      platform: 'General',
      author: '@sec_expert',
      favs: 98,
    },
    {
      id: 3,
      name: 'SQL Query Optimizer',
      description:
        'Menganalisis query lambat dan menyarankan index atau penulisan ulang query.',
      category: 'Data',
      platform: 'OpenAI',
      author: '@db_admin',
      favs: 76,
    },
    {
      id: 4,
      name: 'Research Summarizer',
      description:
        'Merangkum paper ilmiah menjadi poin utama, metode, dan keterbatasan.',
      category: 'Research',
      platform: 'Claude',
      author: '@paper_bot',
      favs: 54,
    },
  ];
  private nextId = 5;

  private checkDuplicate(name: string, exceptId?: number) {
    if (
      this.skills.some(
        (skill) =>
          skill.id !== exceptId &&
          skill.name.toLowerCase() === name.toLowerCase(),
      )
    ) {
      throw new ConflictException('Nama skill sudah digunakan.');
    }
  }

  create(dto: CreateSkillDto): Skill {
    this.checkDuplicate(dto.name);
    const skill = { ...dto, id: this.nextId++ };
    this.skills.push(skill);
    return skill;
  }

  findAll(): Skill[] {
    return this.skills;
  }

  findOne(id: number): Skill {
    const skill = this.skills.find((item) => item.id === id);
    if (!skill)
      throw new NotFoundException(`Skill dengan ID ${id} tidak ditemukan.`);
    return skill;
  }

  update(id: number, dto: UpdateSkillDto): Skill {
    const skill = this.findOne(id);
    if (dto.name !== undefined) this.checkDuplicate(dto.name, id);
    Object.assign(skill, dto);
    return skill;
  }

  remove(id: number): Skill {
    const skill = this.findOne(id);
    this.skills = this.skills.filter((item) => item.id !== id);
    return skill;
  }
}
