import { Injectable } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contacts } from './entities/contact.entity';
import { SendEmailDto } from './dto/send-email.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ContactsService {
  constructor(
    @InjectRepository(Contacts)
    private contactsRep: Repository<Contacts>,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService
  ) { }
  async create(createContactDto: CreateContactDto, fileName:string) {
    const contact = this.contactsRep.create({
      ...createContactDto,
      icon: fileName
    })
    await this.contactsRep.save(contact)
  }

  async findAll() {
    return await this.contactsRep.find()
  }

  findOne(id: number) {
    return `This action returns a #${id} contact`;
  }

  update(id: number, updateContactDto: UpdateContactDto) {
    return `This action updates a #${id} contact`;
  }

  remove(id: number) {
    return `This action removes a #${id} contact`;
  }
  async sendEmail(form: SendEmailDto) {
    await this.mailerService.sendMail({
      to: this.configService.get<string>('MAIL_USER'),
      subject: `Контактная форма с портфолио`,
      template: 'contact',
      context: form
    });
  }
}
