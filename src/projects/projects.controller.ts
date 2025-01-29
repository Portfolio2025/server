import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, UploadedFiles, UseGuards } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Images, Public } from '@decorators';
import { CustomResponseInterceptor } from '@interceptors';
import { AuthGuard } from 'guards/auth.guard';
import { SkipThrottle } from '@nestjs/throttler';

@UseGuards(AuthGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) { }

  @Post(":projectId/images")
  @Images("projectImages")
  @UseInterceptors(CustomResponseInterceptor)
  async addImages(
    @Param("projectId") projectId: number,
    @UploadedFiles() files: Express.Multer.File[]
  ) {
    await this.projectsService.addImage(projectId, files)
    
  }

  @Post()
  async create(
    @Body() createProjectDto: CreateProjectDto,
  ) {
    return await this.projectsService.create(createProjectDto);
  }

  @Get()
  @Public()
  @SkipThrottle()
  async findAll() {
    return await this.projectsService.findAll();
  }

  @Get('slug/:name')
  @Public()
  @SkipThrottle()
  async findOneBySlug(@Param('name') name: string) {
    return await this.projectsService.findOneBySlug(name);
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: number) {
    return this.projectsService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    await this.projectsService.updateProject(+id, updateProjectDto);
  }

  @Delete('image/:id')
  async removeImg(@Param('id') id: string) {
    await this.projectsService.removePicture(+id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.projectsService.removeProject(+id);
  }
}
