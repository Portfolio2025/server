import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SkillService } from './skill.service';
import { CreateSkillDto, CreateSkillGroupDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';

@Controller('skill')
export class SkillController {
  constructor(private readonly skillService: SkillService) {}

  @Post("/group")
  createGroup(@Body() createSkillGroupDto: CreateSkillGroupDto) {
    return this.skillService.createGroup(createSkillGroupDto);
  }
  @Post("/:groupId")
  createSkill(@Param("groupId") id:number, @Body() createSkillDto: CreateSkillDto) {
    return this.skillService.addSkill(id, createSkillDto);
  }

  @Get()
  findAll() {
    return this.skillService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.skillService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSkillDto: UpdateSkillDto) {
    return this.skillService.update(+id, updateSkillDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.skillService.remove(+id);
  }
}
