import { Injectable } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contacts } from './entities/contact.entity';

@Injectable()
export class ContactsService {
  constructor(
    @InjectRepository(Contacts)
    private Contacts: Repository<Contacts>
  ) { }
  async create(createContactDto: CreateContactDto, fileName:string) {
    const contact = this.Contacts.create({
      ...createContactDto,
      icon: fileName
    })
    await this.Contacts.save(contact)
  }

  async findAll() {
    return await this.Contacts.find()
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
}
