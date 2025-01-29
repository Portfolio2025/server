import { HttpException, Injectable } from '@nestjs/common';
import { CreateSkillDto, CreateSkillGroupDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { SkillProjectLink, Skill, SkillGroup } from './entities/skill.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SkillService {
  constructor(
    @InjectRepository(SkillGroup)
    private groupRep: Repository<SkillGroup>,
    @InjectRepository(Skill)
    private skillRep: Repository<Skill>,
    @InjectRepository(SkillProjectLink)
    private projectLinkRep: Repository<SkillProjectLink>,
  ) { }

  // Create a new skill group
  async createGroup(createSkillGroupDto: CreateSkillGroupDto) {
    let group = this.groupRep.create(createSkillGroupDto);
    return await this.groupRep.save(group);
  }

  // Add a new skill to an existing group
  async addSkill(groupId: number, createSkillDto: CreateSkillDto) {
    let group = await this.groupRep.findOne({ where: { id: groupId } });
    if (!group) {
      throw new HttpException(`skillRep group with ID ${groupId} not found.`, 404);
    }
    let skill = this.skillRep.create(createSkillDto);
    skill.group = group;
    return await this.skillRep.save(skill);
  }

  // Placeholder for adding links to skills
  addLinks() {
    // Implementation needed
  }

  // Retrieve all skill groups with their skills and links
  async findAll() {
    return await this.groupRep.find({
      relations: ['skills', 'skills.links']
    });
  }

  // Retrieve a specific skill by ID
  findOne(id: number) {
    return `This action returns a #${id} skill`;
  }

  // Update a specific skill by ID
  update(id: number, _updateSkillDto: UpdateSkillDto) {
    return `This action updates a #${id} skill`;
  }

  // Remove a specific skill by ID
  remove(id: number) {
    return `This action removes a #${id} skill`;
  }
}
