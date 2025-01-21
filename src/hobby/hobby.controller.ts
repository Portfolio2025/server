import { Controller, Get, Post, Body, Patch, Param, Delete, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { HobbyService } from './hobby.service';
import { CreateHobbyDto, CreateHobbySectionDto } from './dto/create-hobby.dto';
import { UpdateHobbyDto, UpdateSectionContentDto } from './dto/update-hobby.dto';
import { Response } from 'express';
import { Images } from '@decorators';
import { CustomResponseInterceptor } from '@interceptors';

@Controller('hobby')
export class HobbyController {
  constructor(
    private readonly hobbyService: HobbyService,
  ) { }

  // Create a new hobby
  @Post()
  async create(@Body() createHobbyDto: CreateHobbyDto, @Res() res: Response) {
    try {
      await this.hobbyService.createHobby(createHobbyDto);
      res.status(200).json({ success: true, message: 'Section images added updated successfully' });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message || 'An error occurred' });
    }
  }

  // Create a new section for a hobby
  @Post("/:id/section")
  createSection(@Param("id") id: number, @Body() createSectionDto: CreateHobbySectionDto) {
    return this.hobbyService.addSection(id, createSectionDto.title);
  }

  // Add an image to a section
  @Post("/:id/image")
  @Images('imgs')
  @UseInterceptors(CustomResponseInterceptor)
  async assImage(
    @Param("id") sectionId: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    await this.hobbyService.addImage(sectionId, file.filename);
  }

  // Get all hobbies
  @Get()
  findAll() {
    return this.hobbyService.findAllHobbies();
  }

  // Get all tab names
  @Get('/tabs')
  findTabs() {
    return this.hobbyService.findTabsNames();
  }

  // Get a specific hobby by ID
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.hobbyService.findOne(+id);
  }

  // Update the name of a hobby
  @Patch(':id')
  updateHobbyName(
    @Param('id') id: string,
    @Body() updateHobbyDto: UpdateHobbyDto
  ) {
    return this.hobbyService.update(+id, updateHobbyDto);
  }

  // Update the content of a section
  @Patch('/:id/content')
  async updateSectionContent(
    @Param('id') id: number,
    @Body() updateContentDto: UpdateSectionContentDto,
    @Res() res: Response
  ) {
    try {
      await this.hobbyService.updateSectionContent(id, updateContentDto);
      res.status(200).json({ success: true, message: 'Section content updated successfully' });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message || 'An error occurred' });
    }
  }

  // Remove a hobby, section, or content
  @Delete(':id/:type')
  remove(@Param('id') id: number, @Param('type') type: "hobby" | "section" | "content") {
    return this.hobbyService.remove(id, type);
  }
}
