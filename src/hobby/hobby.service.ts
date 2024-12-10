import { Injectable } from '@nestjs/common';
import { CreateHobbyDto, CreateHobbySectionDto } from './dto/create-hobby.dto';
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
    private Hobby: Repository<Hobby>,
    @InjectRepository(Section)
    private Section: Repository<Section>,
    @InjectRepository(Content)
    private Content: Repository<Content>,
    @InjectRepository(TextBlock)
    private TextBlock: Repository<TextBlock>,
    @InjectRepository(Picture)
    private Picture: Repository<Picture>,
  ) { }
  async createHobby(createHobbyDto: CreateHobbyDto) {
    const hobby = this.Hobby.create(createHobbyDto);
    await this.Hobby.save(hobby);
  }

  async addSection(id:number, title:string) {
    const hobby = await this.Hobby.findOne({ where: { id } });
    if (!hobby) {
      throw new Error(`Hobby with ID ${id} not found.`);
    }

    const section = this.Section.create({ title, hobby });
    await this.Section.save(section);
    delete section.hobby
  }

  async addImage(sectionId:number, filename:string) {
    const section = await this.Section.findOne({ where: { id: sectionId } });
    if (!section) {
      // fs.unlink()
      const filePath = path.join(__dirname, '../..', 'public', 'imgs', filename)
      fs.unlinkSync(filePath)
      throw new Error(`Section with ID ${sectionId} not found.`);
    }
    const image = this.Picture.create({ path: filename, section });
    await this.Picture.save(image)
  }

  async findAllHobbies() {
    return await this.Hobby.find(
      {
        relations: ['sections', 'sections.content', 'sections.content.details', 'sections.pictures']
      }
    );
  }

  async findTabsNames() {
    return await this.Hobby.find({
      select: ["id", "name"]
    });
  }

  async findOne(id: number) {
    return await this.Hobby.findOne(
      {
        where: { id },
        relations: ['sections', 'sections.content', 'sections.content.details', 'sections.pictures']
      }
    );
  }

  async update(id: number, hobbyDto: UpdateHobbyDto) {
    const hobby = await this.Hobby.findOne({ where: { id } })
    if (!hobby) {
      throw new Error(`Hobby with ID ${id} not found.`);
    }

    return await this.Hobby.update(hobby.id, {
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
    const hobby = await this.Hobby.findOne({ where: { id } });
    if (!hobby) throw new Error(`Hobby with ID ${id} not found.`);
  }

  private async findSectionById(sectionId: number) {
    const section = await this.Section.findOne({ where: { id: sectionId } });
    if (!section) throw new Error(`Section with ID ${sectionId} not found.`);
    return section;
  }

  private async createNewContent(section: Section, updateBody: UpdateSectionContentDto) {
    const content = this.Content.create({ section, type: updateBody.contentType });
    await this.Content.save(content);

    const detailsArray = updateBody.details.map(detail =>
      this.TextBlock.create({ text: detail.text, content })
    );
    await this.TextBlock.save(detailsArray);
  }

  private async updateExistingContent(updateBody: UpdateSectionContentDto) {
    const content = await this.Content.findOne({ where: { id: updateBody.contentId }, relations: ['details'] });
    if (!content) throw new Error(`Content with ID ${updateBody.contentId} not found.`);

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
          await this.TextBlock.save(existingText);
        }
      } else {
        const newText = this.TextBlock.create({ text: frontDetail.text, content });
        await this.TextBlock.save(newText);
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
      await this.TextBlock.delete({ id: text.id });
    }
  }


  async remove(id: number, type: "hobby" | "section" | "content") {
    const entityMap = {
      hobby: this.Hobby,
      section: this.Section,
      content: this.Content,
    };

    const repository = entityMap[type];
    if (!repository) throw new Error(`Unknown type: ${type}`);

    const entity = await repository.findOne({ where: { id } });
    if (!entity) throw new Error(`${type.toUpperCase()} with ID ${id} not found.`);

    await repository.delete(id);
  }
}
