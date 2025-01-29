import { Controller, Get, Post, Body, Patch, Param, Delete, Res, UseInterceptors, UseGuards, UploadedFiles } from '@nestjs/common';
import { HobbyService } from './hobby.service';
import { CreateHobbyDto, CreateHobbySectionDto } from './dto/create-hobby.dto';
import { UpdateHobbyDto, UpdateHobbySectionDto, UpdateSectionContentDto } from './dto/update-hobby.dto';
import { Response } from 'express';
import { Images, Public } from '@decorators';
import { CustomResponseInterceptor } from '@interceptors';
import { AuthGuard } from 'guards/auth.guard';
import { SkipThrottle } from '@nestjs/throttler';
@UseGuards(AuthGuard)
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
      res.status(200).json({ success: true, message: 'Hobby added' });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message || 'An error occurred' });
    }
  }

  // Add an image to a section
  @Post("section/:id/image")
  @Images('imgs')
  @UseInterceptors(CustomResponseInterceptor)
  async assImage(
    @Param("id") sectionId: number,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    await this.hobbyService.addImage(sectionId, files);
  }

  // Create a new section for a hobby
  @Post("/section/:id")
  async createSection(@Param("id") id: number, @Body() createSectionDto: CreateHobbySectionDto) {
    return await this.hobbyService.addSection(id, createSectionDto.title);
  }

  // Get all hobbies
  @Get()
  @Public()
  @SkipThrottle()
  findAll() {
    return this.hobbyService.findAllHobbies();
  }

  // Get all tab names
  @Get('/tabs')
  @Public()
  @SkipThrottle()
  findTabs() {
    return this.hobbyService.findTabsNames();
  }

  // Get a specific hobby by ID
  @Get(':id')
  @Public()
  @SkipThrottle()
  findOne(@Param('id') id: string) {
    return this.hobbyService.findOne(+id);
  }

  // Update the content of a section
  @Patch('section/:id')
  async updateSection(
    @Param('id') id: number,
    @Body() updateSectionDto: UpdateHobbySectionDto,
    @Res() res: Response
  ) {
    try {
      await this.hobbyService.updateSection(id, updateSectionDto);
      res.status(200).json({ success: true, message: 'Section title updated successfully' });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message || 'An error occurred' });
    }
  }

  // Update the content of a section
  @Patch('section/:id/details')
  async updateSectionDetails(
    @Param('id') id: number,
    @Body() updateContentDto: UpdateSectionContentDto,
    @Res() res: Response
  ) {
    try {
      await this.hobbyService.updateSectionDetails(id, updateContentDto);
      res.status(200).json({ success: true, message: 'Section content updated successfully' });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message || 'An error occurred' });
    }
  }

  // Update the name of a hobby
  @Patch(':id')
  updateHobbyName(
    @Param('id') id: string,
    @Body() updateHobbyDto: UpdateHobbyDto
  ) {
    return this.hobbyService.update(+id, updateHobbyDto);
  }

  // Remove a hobby, section, or content
  @Delete(':id/:type')
  remove(@Param('id') id: number, @Param('type') type: "hobby" | "section" | "content") {
    return this.hobbyService.remove(id, type);
  }
}
