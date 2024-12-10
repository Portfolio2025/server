import { Controller, Get, Post, Body, Patch, Param, Delete, Res, UploadedFile } from '@nestjs/common';
import { HobbyService } from './hobby.service';
import { CreateHobbyDto, CreateHobbySectionDto } from './dto/create-hobby.dto';
import { UpdateHobbyDto, UpdateSectionContentDto } from './dto/update-hobby.dto';
import { Response } from 'express';
import { Images } from '@decorators';

@Controller('hobby')
export class HobbyController {
  constructor(
    private readonly hobbyService: HobbyService,
  ) { }

  @Post()
  async create(@Body() createHobbyDto: CreateHobbyDto, @Res() res:Response) {
    try {
      await this.hobbyService.createHobby(createHobbyDto);
      res.status(200).json({ success: true, message: 'Section images added updated successfully' });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message || 'An error occurred' });
    }
  }

  @Post("/:id/section")
  createSection(@Param("id") id: number, @Body() createSectionDto: CreateHobbySectionDto) {
    return this.hobbyService.addSection(id, createSectionDto.title);
  }

  @Post("/:id/image")
  @Images('imgs')
  async assImage(
    @Param("id") sectionId: number,
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response
  ) {
    try {
      await this.hobbyService.addImage(sectionId, file.filename)
      res.status(200).json({ success: true, message: 'Section images added updated successfully' });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message || 'An error occurred' });
    }
  }
  

  @Get()
  findAll() {
    return this.hobbyService.findAllHobbies();
  }

  @Get('/tabs')
  findTabs() {
    return this.hobbyService.findTabsNames();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.hobbyService.findOne(+id);
  }


  @Patch(':id')
  updateHobbyName(
    @Param('id') id: string,
    @Body() updateHobbyDto: UpdateHobbyDto
  ) {
    return this.hobbyService.update(+id, updateHobbyDto);
  }

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


  @Delete(':id/:type')
  remove(@Param('id') id: number, @Param('type') type: "hobby" | "section" | "content") {
    return this.hobbyService.remove(id, type);
  }
}
