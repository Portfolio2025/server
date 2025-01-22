import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { SkillService } from './skill.service';
import { CreateSkillDto, CreateSkillGroupDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { AuthGuard } from 'guards/auth.guard';
import { Public } from '@decorators';

@UseGuards(AuthGuard)
@Controller('skill')
export class SkillController {
  constructor(private readonly skillService: SkillService) { }

  // Create a new skill group
  @Post("/group")
  createGroup(@Body() createSkillGroupDto: CreateSkillGroupDto) {
    return this.skillService.createGroup(createSkillGroupDto);
  }

  // Add a new skill to a specific group
  @Post("group/:groupId")
  createSkill(@Param("groupId") id: number, @Body() createSkillDto: CreateSkillDto) {
    return this.skillService.addSkill(id, createSkillDto);
  }

  // Retrieve all skills
  @Get()
  @Public()
  findAll() {
    return this.skillService.findAll();
  }

  // Retrieve a specific skill by ID
  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.skillService.findOne(+id);
  }

  // Update a specific skill by ID
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSkillDto: UpdateSkillDto) {
    return this.skillService.update(+id, updateSkillDto);
  }

  // Remove a specific skill by ID
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.skillService.remove(+id);
  }
}
