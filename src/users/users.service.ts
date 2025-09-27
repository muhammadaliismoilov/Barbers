import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/user.dto';


@Injectable()
export class UsersService {
  create(createUserDto: CreateUserDto) {
    try {
      
    } catch (error) {
      throw new InternalServerErrorException
    }
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
