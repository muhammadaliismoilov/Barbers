import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role, User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Barber } from 'src/barbers/barber.entity';


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Barber)
    private readonly barberRepo: Repository<Barber>,
    private readonly jwtService: JwtService,
  ) {}

  // Helper: tokenlar yaratish
  private getTokens(user: User | Barber) {
    const payload = { sub: user.id, phone: user.phone, role: user.role };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET || 'access_secret',
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET || 'refresh_secret',
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }

  // REGISTER
  async register(dto: RegisterDto) {
    try {
      const exist = await this.userRepo.findOne({
        where: { phone: dto.phone },
      });
      if (exist)
        throw new ConflictException('Bu raqam bilan ro‘yxatdan o‘tilgan');

      const hashed = await bcrypt.hash(dto.password, 10);

      const user = this.userRepo.create({
        fullName: dto.fullName,
        phone: dto.phone,
        password: hashed,
        role: [Role.USER],
      });

      const saved = await this.userRepo.save(user);

      return user;
    } catch (error) {
      if (error instanceof ConflictException) throw error;
      throw new InternalServerErrorException(
        'Ro‘yxatdan o‘tishda serverda xatolik yuz berdi',
        error.message,
      );
    }
  }

    //LOGIN ADMIN

    async loginAdmin(dto: LoginDto) {
    try {
      let entity : User | Barber| null= null;

      entity =await this.userRepo.findOne({where:{phone:dto.phone},select:['id', 'password','role']})
      
      if(!entity){
        entity =await this.barberRepo.findOne({where:{phone:dto.phone},select:['id', 'password','role']})
      }

      if (!entity) {
        throw new NotFoundException('Foydalanuvchi topilmadi');
      }
      if(!entity.role.includes(Role.ADMIN)){
        throw new UnauthorizedException('Foydalanuvchi admin emas');
      }

      const match = await bcrypt.compare(dto.password, entity.password);
      if (!match) {
        throw new UnauthorizedException('Parol noto‘g‘ri');
      }

      // Tokenlar generatsiya qilish
      const tokens = this.getTokens(entity);


      return {
        user: {
          id: entity.id,
          role: entity.role,
        },
        ...tokens,
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      if (error instanceof UnauthorizedException) throw error;
      console.log(error);
      
      throw new InternalServerErrorException(
        'Login qilishda serverda xatolik yuz berdi',
        error.message,
      );
    }
  }


  //LOGIN USER

  async login(dto: LoginDto) {
    try {

      const entity =await this.userRepo.findOne({where:{phone:dto.phone},select:['id', 'password','role']})

      if (!entity) {
        throw new NotFoundException('Foydalanuvchi topilmadi');
      }

      const match = await bcrypt.compare(dto.password, entity.password);
      if (!match) {
        throw new UnauthorizedException('Parol noto‘g‘ri');
      }

      // Tokenlar generatsiya qilish
      const tokens = this.getTokens(entity);


      return {
        user: {
          id: entity.id,
          role: entity.role,
        },
        ...tokens,
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      if (error instanceof UnauthorizedException) throw error;
      console.log(error);
      
      throw new InternalServerErrorException(
        'Login qilishda serverda xatolik yuz berdi',
        error.message,
      );
    }
  }

   async loginBarber(dto: LoginDto) {
    try {
      const entity =await this.barberRepo.findOne({where:{phone:dto.phone},select:['id', 'password','role']})

      if (!entity) {
        throw new NotFoundException('Foydalanuvchi topilmadi');
      }
      if(!entity.role.includes(Role.BARBER)){
        throw new UnauthorizedException('Foydalanuvchi barber emas');
      }

      const match = await bcrypt.compare(dto.password, entity.password);
      if (!match) {
        throw new UnauthorizedException('Parol noto‘g‘ri');
      }

      // Tokenlar generatsiya qilish
      const tokens = this.getTokens(entity);


      return {
        user: {
          id: entity.id,
          role: entity.role,
        },
        ...tokens,
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      if (error instanceof UnauthorizedException) throw error;
      console.log(error);
      
      throw new InternalServerErrorException(
        'Login qilishda serverda xatolik yuz berdi',
        error.message,
      );
    }
  }

  async changePassword(phone: string, newPassword: string) {
    try {
      const user = await this.userRepo.findOne({ where: { phone } });
      if (!user) throw new NotFoundException('Foydalanuvchi topilmadi');
      const hashed = await bcrypt.hash(newPassword, 10);
      await this.userRepo.update({ phone }, { password: hashed });
    } catch (error) {
      if(error instanceof NotFoundException) throw error
      throw new InternalServerErrorException(
        'Parolni o‘zgartirishda serverda xatolik yuz berdi',
        error.message,
      );
    }
  }

  async logOut(){
    return {message: "Foydalanuvchi muvaffaqiyatli tizimdan chiqdi"}
  }



}
