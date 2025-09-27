import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role, User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

  constructor(@InjectRepository(User)
    private readonly userRepo: Repository<User>,
  
  ){}

  async register (dto:RegisterDto){
    try {
      const phone = await this.userRepo.findOne({where:{phone:dto.phone}})
      if(phone) throw new ConflictException("Bu raqam bilan ro`yxatdan o`tilgan")

         const hashed = await bcrypt.hash(dto.password, 10);

        const user = this.userRepo.create({
        full_name: dto.fullname,
        phone: dto.phone,
        password: hashed,
        role: Role.USER, // default
      });

        const saved = await this.userRepo.save(user);

      return user;

    } catch (error) {
      throw new InternalServerErrorException("Ro`yxatdan o`tishda serverda xatolik yuz brdi", error.message)
    }
  } 
}
