import { Module } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { ContactsController } from './contacts.controller';
import { Contacts } from './entities/contact.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [ContactsController],
  providers: [ContactsService, JwtService],
  imports: [
    TypeOrmModule.forFeature([
    Contacts,
  ])]
})
export class ContactsModule { }
