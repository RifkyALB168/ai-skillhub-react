import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { SkillsService } from './skills.service';
import { SkillsController } from './skills.controller';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [SkillsController],
  providers: [SkillsService],
})
export class SkillsModule {}
