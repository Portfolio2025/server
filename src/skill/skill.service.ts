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
    private groupRep: Repository<SkillGroup>,
    @InjectRepository(Skill)
    private skillRep: Repository<Skill>,
    @InjectRepository(ProjectLink)
    private linkRep: Repository<ProjectLink>,
  ) { }
  async createGroup(createSkillGroupDto: CreateSkillGroupDto) {
    let group = this.groupRep.create(createSkillGroupDto)
    return await this.groupRep.save(group);
  }
  async addSkill(groupId: number, createSkillDto: CreateSkillDto) {
    let group = await this.groupRep.findOne({ where: { id: groupId } })
    if (!group) {
      throw new Error(`skillRep group with ID ${groupId} not found.`)
    }
    let skill = this.skillRep.create(createSkillDto)
    skill.group = group
    return await this.skillRep.save(skill)
  }

  addLinks() {

  }

  async findAll() {
    return await this.groupRep.find({
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
