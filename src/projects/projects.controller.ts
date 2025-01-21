import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, UploadedFiles } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Images } from '@decorators';
import { CustomResponseInterceptor } from '@interceptors';

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
    this.projectsService.addImage(projectId, files)
  }

  @Post()
  async create(
    @Body() createProjectDto: CreateProjectDto,
  ) {
    return await this.projectsService.create(createProjectDto);
  }

  @Get()
  async findAll() {
    return await this.projectsService.findAll();
  }

  @Get('slug/:name')
  async findOneBySlug(@Param('name') name: string) {
    return await this.projectsService.findOneBySlug(name);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.projectsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(+id, updateProjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectsService.remove(+id);
  }
}
