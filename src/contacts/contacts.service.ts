import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contacts } from './entities/contact.entity';
import { SendEmailDto } from './dto/send-email.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ContactsService {
  constructor(
    @InjectRepository(Contacts)
    private readonly contactsRep: Repository<Contacts>,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService
  ) { }

  // Create a new contact with the provided data and file name
  async create(createContactDto: CreateContactDto, files: Express.Multer.File[]) {
    const contact = this.contactsRep.create({
      ...createContactDto,
      icon: files['uploadImage[]'].pop().filename
    });
    await this.contactsRep.save(contact);
  }

  // Retrieve all contacts from the database
  async findAll() {
    return await this.contactsRep.find();
  }

  // Retrieve a single contact by its ID
  findOne(id: number) {
    return `This action returns a #${id} contact`;
  }

  // Update a contact by its ID with the provided data
  async update(id: number, updateContactDto: UpdateContactDto) {
    const contact = await this.contactsRep.findOne({ where: { id } })
    if (!contact) {
      throw new NotFoundException('Object not found for update');
    }
    await this.contactsRep.update(contact.id, {
      ...updateContactDto
    })
  }

  // Remove a contact by its ID
  async remove(id: number) {
    const contact = await this.contactsRep.findOne({ where: { id } })
    if (!contact) {
      throw new NotFoundException('Object not found for update');
    }
    const iconPath = path.join(__dirname, `../../public/contact-icons/${contact.icon}`)
    try {
      await fs.promises.unlink(iconPath)
    } catch (error) {
      throw new NotFoundException('Object not found for delete icon');
    }
    await this.contactsRep.delete(contact)
  }

  // Send an email using the provided form data
  async sendEmail(form: SendEmailDto) {
    await this.mailerService.sendMail({
      to: this.configService.get<string>('MAIL_USER'),
      subject: `Контактная форма с портфолио`,
      template: 'contact',
      context: form
    });
  }
}
