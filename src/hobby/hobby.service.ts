import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateHobbyDto } from './dto/create-hobby.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Hobby, Section, TextBlock, Picture, TextGroups } from './entities/hobby.entity';
import { Repository } from 'typeorm';
import { UpdateHobbyDto, UpdateHobbySectionDto, UpdateSectionContentDto } from './dto/update-hobby.dto';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class HobbyService {
  constructor(
    @InjectRepository(Hobby)
    private hobbyRep: Repository<Hobby>,
    @InjectRepository(Section)
    private sectionRep: Repository<Section>,
    @InjectRepository(TextGroups)
    private groupRep: Repository<TextGroups>,
    @InjectRepository(TextBlock)
    private textRep: Repository<TextBlock>,
    @InjectRepository(Picture)
    private pictureRep: Repository<Picture>,
  ) { }

  // Create a new hobby
  async createHobby(createHobbyDto: CreateHobbyDto) {
    const hobby = this.hobbyRep.create(createHobbyDto);
    await this.hobbyRep.save(hobby);
  }

  // Add a new section to a hobby
  async addSection(id: number, title: string) {
    const hobby = await this.hobbyRep.findOne({ where: { id } });
    if (!hobby) {
      throw new NotFoundException(`hobbyRep with ID ${id} not found.`);
    }

    const section = this.sectionRep.create({ title, hobby });
    await this.sectionRep.save(section);
    delete section.hobby;
    return { status: true, message: `Section added in '${hobby.name}'"` }
  }

  // Add an image to a section
  async addImage(sectionId: number, files: Express.Multer.File[]) {
    const section = await this.sectionRep.findOne({ where: { id: sectionId } });
    if (!section) {
      throw new NotFoundException(`sectionRep with ID ${sectionId} not found.`);
    }
    for (const i of files['uploadImage[]']) {
      const image = this.pictureRep.create({ path: i.filename, section });
      await this.pictureRep.save(image);
    }
  }

  // Find all hobbies with their relations
  async findAllHobbies() {
    return await this.hobbyRep.find({
      relations: ['sections', 'sections.content', 'sections.content.details', 'sections.pictures']
    });
  }

  // Find all hobby names and IDs
  async findTabsNames() {
    return await this.hobbyRep.find({
      select: ["id", "name"]
    });
  }

  // Find a specific hobby by ID with its relations
  async findOne(id: number) {
    return await this.hobbyRep.findOne({
      where: { id },
      relations: ['sections', 'sections.content', 'sections.content.details', 'sections.pictures']
    });
  }

  // Update a hobby by ID
  async update(id: number, hobbyDto: UpdateHobbyDto) {
    const hobby = await this.hobbyRep.findOne({ where: { id } });
    if (!hobby) {
      throw new NotFoundException(`hobby with ID ${id} not found.`);
    }

    return await this.hobbyRep.update(hobby.id, {
      ...hobbyDto
    });
  }

  // Find a section by ID
  private async findSectionById(sectionId: number) {
    const section = await this.sectionRep.findOne({ where: { id: sectionId } });
    if (!section) throw new NotFoundException(`sectionRep with ID ${sectionId} not found.`);
    return section;
  }

  async updateSection(id: number, sectionDto: UpdateHobbySectionDto) {
    const section = await this.sectionRep.findOne({ where: { id } });
    if (!section) {
      throw new NotFoundException(`section with ID ${id} not found.`);
    }

    return await this.sectionRep.update(section.id, {
      ...sectionDto
    });
  }

  // Update section content
  async updateSectionDetails(id: number, updateBody: UpdateSectionContentDto) {
    const section = await this.findSectionById(id);
    if (updateBody.groupId === -1) {
      await this.createNewGroup(section, updateBody);
      return;
    }
    await this.updateExistingGroup(updateBody);
  }

  // Create new content for a section
  private async createNewGroup(section: Section, updateBody: UpdateSectionContentDto) {
    const content = this.groupRep.create({ section, type: updateBody.contentType });
    await this.groupRep.save(content);

    // Create and save new text blocks for the content
    const detailsArray = updateBody.details.map(detail =>
      this.textRep.create({ text: detail.text, content })
    );
    await this.textRep.save(detailsArray);
  }

  // Update existing content
  private async updateExistingGroup(updateBody: UpdateSectionContentDto) {
    const content = await this.groupRep.findOne({ where: { id: updateBody.groupId }, relations: ['details'] });
    if (!content) throw new NotFoundException(`group with ID ${updateBody.groupId} not found.`);
    const existingTexts = content.details || [];
    const newTexts = updateBody.details;

    await this.handleNewOrUpdatedTexts(existingTexts, newTexts, content);

    await this.removeOldTexts(existingTexts, newTexts);
  }

  // Handle new or updated text blocks
  private async handleNewOrUpdatedTexts(
    existingTexts: TextBlock[],
    newTexts: { id?: number, text: string }[],
    content: TextGroups
  ) {
    for (const frontDetail of newTexts) {
      const existingText = existingTexts.find(text => text.id === frontDetail.id);

      if (existingText) {
        if (existingText.text !== frontDetail.text) {
          existingText.text = frontDetail.text; // Update text if it has changed
          await this.textRep.save(existingText);
        }
      } else {
        const newText = this.textRep.create({ text: frontDetail.text, content });
        await this.textRep.save(newText); // Save new text block
      }
    }
  }

  // Remove old text blocks that are no longer needed
  private async removeOldTexts(
    existingTexts: TextBlock[],
    newTexts: { id?: number, text: string }[]
  ) {
    const textsToRemove = existingTexts.filter(existingText => {
      return !newTexts.some(newText => newText.id === existingText.id);
    });
    for (const text of textsToRemove) {
      await this.textRep.delete({ id: text.id }); // Delete old text blocks
    }
  }

  // Remove an entity (hobby, section, or content) by ID
  async remove(id: number, type: "hobby" | "section" | "content") {
    const entityMap = {
      hobby: this.hobbyRep,
      section: this.sectionRep,
      content: this.groupRep,
    };

    const repository = entityMap[type];
    if (!repository) throw new NotFoundException(`Unknown type: ${type}`);

    const entity = await repository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`${type.toUpperCase()} with ID ${id} not found.`);

    if (type === "section" || type === "hobby") {
      await this.removeSectionPictures(id, type);
    }

    await repository.delete(id);
  }

  private async removeSectionPictures(id: number, type: "hobby" | "section") {
    const sections = type === "hobby"
      ? await this.sectionRep.find({ where: { hobby: { id } }, relations: ["pictures"] })
      : [await this.sectionRep.findOne({ where: { id }, relations: ["pictures"] })];

    for (const section of sections) {
      if (section) {
        for (const dbFile of section.pictures) {
          const sectionPicturePath = path.join(__dirname, `../../public/imgs/${dbFile.path}`);
          try {
            await fs.promises.unlink(sectionPicturePath);
          } catch (error) {
          }
        }
      }
    }
  }
}
