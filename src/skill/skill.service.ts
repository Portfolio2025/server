import { Injectable } from '@nestjs/common';
import { CreateSkillDto, CreateSkillGroupDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { ProjectLink, Skill, SkillGroup } from './entities/skill.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SkillService {
  constructor(
    @InjectRepository(SkillGroup)
    private Group: Repository<SkillGroup>,
    @InjectRepository(Skill)
    private Skill: Repository<Skill>,
    @InjectRepository(ProjectLink)
    private Link: Repository<ProjectLink>,
  ) { }
  async createGroup(createSkillGroupDto: CreateSkillGroupDto) {
    let group = this.Group.create(createSkillGroupDto)
    return await this.Group.save(group);
  }
  async addSkill(groupId: number, createSkillDto: CreateSkillDto) {
    let group = await this.Group.findOne({ where: { id: groupId } })
    if (!group) {
      throw new Error(`Skill group with ID ${groupId} not found.`)
    }
    let skill = this.Skill.create(createSkillDto)
    skill.group = group
    return await this.Skill.save(skill)
  }

  addLinks() {

  }

  async findAll() {
    return await this.Group.find({
      relations: ['skills', 'skills.links']
    })
  }

  findOne(id: number) {
    return `This action returns a #${id} skill`;
  }

  update(id: number, updateSkillDto: UpdateSkillDto) {
    return `This action updates a #${id} skill`;
  }

  remove(id: number) {
    return `This action removes a #${id} skill`;
  }
}
