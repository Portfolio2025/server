import { Module } from '@nestjs/common';
import { SkillService } from './skill.service';
import { SkillController } from './skill.controller';
import { ProjectLink, Skill, SkillGroup } from './entities/skill.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [SkillController],
  providers: [SkillService],
  imports: [
    TypeOrmModule.forFeature([
      Skill,
      SkillGroup,
      ProjectLink,
    ])
  ]
})
export class SkillModule {}
