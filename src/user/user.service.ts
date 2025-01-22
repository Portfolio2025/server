import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon2 from 'argon2';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRep: Repository<User>
  ) { }
  
  async initUser() {
    const tableLength = await this.userRep.count()
    if (tableLength === 0) {
      const user = this.userRep.create({
        name: "Aleksei Kozlov",
        email: "aleksei22891@gmail.com",
        password: await argon2.hash("qwerty")
      })
      this.userRep.save(user)
    }
  }

  findAll() {
    return `This action returns all user`;
  }

  async findOne(id: number) {
    const user = await this.userRep.findOne({
      where:{id}
    })
    return user
  }

  async findOneByPayload(payload: any) {
    const user = await this.userRep.findOne({
      where: payload
    })
    return user
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
