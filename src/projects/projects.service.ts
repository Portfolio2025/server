import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Project, ProjectImage } from './entities/project.entity';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';

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
      throw new NotFoundException(`Project by ${projectId} ID not found`)
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

  async updateProject(id: number, updateProjectDto: UpdateProjectDto) {
    const project = await this.projectRep.findOne({ where: { id } })
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found.`)
    }
    this.projectRep.update(id, {
      ...updateProjectDto
    })

  }

  async removeProject(id: number) {
    const project = await this.projectRep.findOne({
      where: { id },
      relations: ["imgs"]
    })
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found.`)
    }
    for (const img of project.imgs) {
      const projectPicturePath = path.join(__dirname, `../../public/projectImages/${img.imgPath}`);
      try {
        await fs.promises.unlink(projectPicturePath);
      } catch (error) {
      }
    }
    await this.projectRep.delete(project.id)
  }
  async removePicture(id: number) {
    const img = await this.imageRep.findOne({ where: { id } })
    if (!img) {
      throw new NotFoundException(`Image with ID ${id} not found.`)
    }
    const projectPicturePath = path.join(__dirname, `../../public/projectImages/${img.imgPath}`);
    try {
      await fs.promises.unlink(projectPicturePath);
    } catch (error) {
    }
    this.imageRep.delete(img.id)
  }
}
