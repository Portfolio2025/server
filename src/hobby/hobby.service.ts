import { Injectable } from '@nestjs/common';
import { CreateHobbyDto } from './dto/create-hobby.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Hobby, Section, Content, TextBlock, Picture } from './entities/hobby.entity';
import { Repository } from 'typeorm';
import { UpdateHobbyDto, UpdateSectionContentDto } from './dto/update-hobby.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class HobbyService {
  constructor(
    @InjectRepository(Hobby)
    private hobbyRep: Repository<Hobby>,
    @InjectRepository(Section)
    private sectionRep: Repository<Section>,
    @InjectRepository(Content)
    private contentRep: Repository<Content>,
    @InjectRepository(TextBlock)
    private textRep: Repository<TextBlock>,
    @InjectRepository(Picture)
    private pictureRep: Repository<Picture>,
  ) { }
  async createHobby(createHobbyDto: CreateHobbyDto) {
    const hobby = this.hobbyRep.create(createHobbyDto);
    await this.hobbyRep.save(hobby);
  }

  async addSection(id:number, title:string) {
    const hobby = await this.hobbyRep.findOne({ where: { id } });
    if (!hobby) {
      throw new Error(`hobbyRep with ID ${id} not found.`);
    }

    const section = this.sectionRep.create({ title, hobby });
    await this.sectionRep.save(section);
    delete section.hobby
  }

  async addImage(sectionId:number, filename:string) {
    const section = await this.sectionRep.findOne({ where: { id: sectionId } });
    if (!section) {
      // fs.unlink()
      const filePath = path.join(__dirname, '../..', 'public', 'imgs', filename)
      fs.unlinkSync(filePath)
      throw new Error(`sectionRep with ID ${sectionId} not found.`);
    }
    const image = this.pictureRep.create({ path: filename, section });
    await this.pictureRep.save(image)
  }

  async findAllHobbies() {
    return await this.hobbyRep.find(
      {
        relations: ['sections', 'sections.content', 'sections.content.details', 'sections.pictures']
      }
    );
  }

  async findTabsNames() {
    return await this.hobbyRep.find({
      select: ["id", "name"]
    });
  }

  async findOne(id: number) {
    return await this.hobbyRep.findOne(
      {
        where: { id },
        relations: ['sections', 'sections.content', 'sections.content.details', 'sections.pictures']
      }
    );
  }

  async update(id: number, hobbyDto: UpdateHobbyDto) {
    const hobby = await this.hobbyRep.findOne({ where: { id } })
    if (!hobby) {
      throw new Error(`hobbyRep with ID ${id} not found.`);
    }

    return await this.hobbyRep.update(hobby.id, {
      id: hobby.id,
      ...hobbyDto
    })
  }

  async updateSectionContent(id: number, updateBody: UpdateSectionContentDto) {
    const hobby = await this.findHobbyById(id);
    const section = await this.findSectionById(updateBody.sectionId);

    if (updateBody.contentId === -1) {
      await this.createNewContent(section, updateBody);
      return
    }

    await this.updateExistingContent(updateBody);
  }

  private async findHobbyById(id: number) {
    const hobby = await this.hobbyRep.findOne({ where: { id } });
    if (!hobby) throw new Error(`hobbyRep with ID ${id} not found.`);
  }

  private async findSectionById(sectionId: number) {
    const section = await this.sectionRep.findOne({ where: { id: sectionId } });
    if (!section) throw new Error(`sectionRep with ID ${sectionId} not found.`);
    return section;
  }

  private async createNewContent(section: Section, updateBody: UpdateSectionContentDto) {
    const content = this.contentRep.create({ section, type: updateBody.contentType });
    await this.contentRep.save(content);

    const detailsArray = updateBody.details.map(detail =>
      this.textRep.create({ text: detail.text, content })
    );
    await this.textRep.save(detailsArray);
  }

  private async updateExistingContent(updateBody: UpdateSectionContentDto) {
    const content = await this.contentRep.findOne({ where: { id: updateBody.contentId }, relations: ['details'] });
    if (!content) throw new Error(`contentRep with ID ${updateBody.contentId} not found.`);

    const existingTexts = content.details || [];
    const newTexts = updateBody.details;

    await this.handleNewOrUpdatedTexts(existingTexts, newTexts, content);

    await this.removeOldTexts(existingTexts, newTexts);
  }

  private async handleNewOrUpdatedTexts(
    existingTexts: TextBlock[],
    newTexts: { id?: number, text: string }[],
    content: Content
  ) {
    for (const frontDetail of newTexts) {
      const existingText = existingTexts.find(text => text.id === frontDetail.id);

      if (existingText) {
        if (existingText.text !== frontDetail.text) {
          existingText.text = frontDetail.text;
          await this.textRep.save(existingText);
        }
      } else {
        const newText = this.textRep.create({ text: frontDetail.text, content });
        await this.textRep.save(newText);
      }
    }
  }

  private async removeOldTexts(
    existingTexts: TextBlock[],
    newTexts: { id?: number, text: string }[]
  ) {
    const textsToRemove = existingTexts.filter(existingText => {
      return !newTexts.some(newText => newText.id === existingText.id);
    });
    for (const text of textsToRemove) {
      await this.textRep.delete({ id: text.id });
    }
  }


  async remove(id: number, type: "hobby" | "section" | "content") {
    const entityMap = {
      hobby: this.hobbyRep,
      section: this.sectionRep,
      content: this.contentRep,
    };

    const repository = entityMap[type];
    if (!repository) throw new Error(`Unknown type: ${type}`);

    const entity = await repository.findOne({ where: { id } });
    if (!entity) throw new Error(`${type.toUpperCase()} with ID ${id} not found.`);

    await repository.delete(id);
  }
}
