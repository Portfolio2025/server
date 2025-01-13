import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Res } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { CustomResponseInterceptor } from '@interceptors';
import { Images } from '@decorators';
import { SendEmailDto } from './dto/send-email.dto';
import { Response } from 'express';

@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post()
  @Images("contact-icons")
  @UseInterceptors(CustomResponseInterceptor)
  async create(@Body() createContactDto: CreateContactDto, @UploadedFile() file: Express.Multer.File,) {
    await this.contactsService.create(createContactDto, file.filename);
  }

  @Get()
  async findAll() {
    return await this.contactsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contactsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateContactDto: UpdateContactDto) {
    return this.contactsService.update(+id, updateContactDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contactsService.remove(+id);
  }
  @Post('send-email')
  async sendEmail(@Body() sendEmailDto: SendEmailDto, @Res() res: Response) {
    try {
      await this.contactsService.sendEmail(sendEmailDto);
      res.status(200).json({ success: true, message: 'Message sent' });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message || 'An error occurred' });
    }
  }
}
