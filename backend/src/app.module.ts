import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { SkillsModule } from './skills/skills.module';

@Module({ imports: [AuthModule, SkillsModule] })
export class AppModule {}
