import { HttpException, Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Project, ProjectImage } from './entities/project.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectRep: Repository<Project>,
    @InjectRepository(ProjectImage)
    private imageRep: Repository<ProjectImage>,
  ) { }

  async create(createProjectDto: CreateProjectDto) {
    const project = this.projectRep.create(createProjectDto)
    project.slug = project.name.toLowerCase().replace(/[\s]+/g, '-');
    await this.projectRep.save(project)
  }

  async addImage(projectId: number, filenames: Express.Multer.File[]) {
    const project = await this.projectRep.findOne({
      where: {
        id: projectId
      }
    })
    if (!project) {
      throw new HttpException(`Project by ${projectId} ID not found`, 404)
    }
    for (let i of filenames['uploadImage[]']) {
      const img = this.imageRep.create({
        imgPath: i.filename,
        project
      })
      await this.imageRep.save(img)
    }
  }

  async findAll() {
    return await this.projectRep.find({
      relations: ["imgs"]
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} project`;
  }

  async findOneBySlug(slug: string) {
    return await this.projectRep.findOne({
      where: { slug },
      relations: ["imgs"]
    });
  }

  update(id: number, updateProjectDto: UpdateProjectDto) {
    return `This action updates a #${id} project`;
  }

  remove(id: number) {
    return `This action removes a #${id} project`;
  }
}
