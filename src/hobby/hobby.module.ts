import { Module } from '@nestjs/common';
import { HobbyService } from './hobby.service';
import { HobbyController } from './hobby.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hobby, Section, TextBlock, Picture, TextGroups } from './entities/hobby.entity';

@Module({
  controllers: [HobbyController],
  providers: [HobbyService],
  imports: [
    TypeOrmModule.forFeature([
      Hobby,
      Section,
      TextBlock,
      TextGroups,
      Picture,
    ])
  ]
})
export class HobbyModule { }
