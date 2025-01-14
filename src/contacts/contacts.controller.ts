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
  constructor(private readonly contactsService: ContactsService) { }

  // Create a new contact
  @Post()
  @Images("contact-icons") // accepts a file, saves it to a folder, and passes the filename for saving in the database
  @UseInterceptors(CustomResponseInterceptor) //Uses a custom response interceptor that reacts to the main function's output. If the main function throws an error, it checks if there is an image name and deletes it.
  async create(@Body() createContactDto: CreateContactDto, @UploadedFile() file: Express.Multer.File) {
    await this.contactsService.create(createContactDto, file.filename);
  }

  // Retrieve all contacts
  @Get()
  async findAll() {
    return await this.contactsService.findAll();
  }

  // Retrieve a single contact by ID
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contactsService.findOne(+id);
  }

  // Update a contact by ID
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateContactDto: UpdateContactDto) {
    return this.contactsService.update(+id, updateContactDto);
  }

  // Delete a contact by ID
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contactsService.remove(+id);
  }

  // Send an email
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
