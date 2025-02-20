import { Module } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { ContactsController } from './contacts.controller';
import { Contacts } from './entities/contact.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [ContactsController],
  providers: [ContactsService],
  imports: [
    TypeOrmModule.forFeature([
    Contacts,
  ])]
})
export class ContactsModule { }
