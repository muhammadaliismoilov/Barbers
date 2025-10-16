import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role, Users } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto, LoginDto, ChangePasswordDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepo: Repository<Users>,
    private readonly jwtService: JwtService,
  ) {}

  // Helper: tokenlar yaratish
  private async getTokens(user: Users) {
    const payload = {
      sub: user.id,
      phone: user.phone,
      role: user.role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET || 'access_secret',
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET || 'refresh_secret',
        expiresIn: '7d',
      }),
    ]);

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
      await this.userRepo.save(user);
      return user;
    } catch (error) {
      if (error instanceof ConflictException) throw error;
      throw new InternalServerErrorException(
        'Ro‘yxatdan o‘tishda serverda xatolik yuz berdi',
        error.message,
      );
    }
  }

  // LOGIN ADMIN

  async loginAdmin(dto: LoginDto) {
    try {
      const user = await this.userRepo.findOne({
        where: { phone: dto.phone },
        select: ['id', 'password', 'role', 'phone'],
      });

      if (!user) {
        throw new NotFoundException('Foydalanuvchi topilmadi');
      }
      if (!user.role.includes(Role.ADMIN)) {
        throw new UnauthorizedException('Foydalanuvchi admin emas');
      }

      const match = await bcrypt.compare(dto.password, user.password);
      if (!match) {
        throw new UnauthorizedException('Parol noto‘g‘ri');
      }

      // Tokenlar generatsiya qilish
      const tokens = await this.getTokens(user);

      // 🔒 Refresh tokenni DB’da hashlab saqlaymiz
      const hashedRefreshToken = await bcrypt.hash(tokens.refreshToken, 10);
      await this.userRepo.update(user.id, { hashedRefreshToken });

      return {
        id: user.id,
        role: user.role,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      if (error instanceof UnauthorizedException) throw error;

      throw new InternalServerErrorException(
        'Login qilishda serverda xatolik yuz berdi',
        error.message,
      );
    }
  }

  //LOGIN USER

  async login(dto: LoginDto) {
    try {
      const user = await this.userRepo.findOne({
        where: { phone: dto.phone },
        select: ['id', 'password', 'role', 'phone'], // phone ham kerak payload uchun
      });

      if (!user) {
        throw new NotFoundException('Foydalanuvchi topilmadi');
      }

      const isPasswordValid = await bcrypt.compare(dto.password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Parol noto‘g‘ri');
      }

      // 🔐 Tokenlar generatsiya qilish
      const tokens = await this.getTokens(user);

      // 🔒 Refresh tokenni DB’da hashlab saqlaymiz
      const hashedRefreshToken = await bcrypt.hash(tokens.refreshToken, 10);
      await this.userRepo.update(user.id, { hashedRefreshToken });

      return {
        id: user.id,
        role: user.role,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      if (error instanceof UnauthorizedException) throw error;

      console.error('Login error:', error);

      throw new InternalServerErrorException(
        'Login qilishda serverda xatolik yuz berdi',
      );
    }
  }

  async loginBarber(dto: LoginDto) {
    try {
      const user = await this.userRepo.findOne({
        where: { phone: dto.phone },
        select: ['id', 'password', 'role', 'phone'],
      });

      if (!user) {
        throw new NotFoundException('Foydalanuvchi topilmadi');
      }
      if (!user.role.includes(Role.BARBER)) {
        throw new UnauthorizedException('Foydalanuvchi barber emas');
      }

      const match = await bcrypt.compare(dto.password, user.password);
      if (!match) {
        throw new UnauthorizedException('Parol noto‘g‘ri');
      }

      // 🔐 Tokenlar generatsiya qilish
      const tokens = await this.getTokens(user);

      // 🔒 Refresh tokenni DB’da hashlab saqlaymiz
      const hashedRefreshToken = await bcrypt.hash(tokens.refreshToken, 10);
      await this.userRepo.update(user.id, { hashedRefreshToken });

      return {
        id: user.id,
        role: user.role,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      if (error instanceof UnauthorizedException) throw error;
      throw new InternalServerErrorException(
        'Login qilishda serverda xatolik yuz berdi',
        error.message,
      );
    }
  }

  async changePassword(dto: ChangePasswordDto) {
    try {
      const user = await this.userRepo.findOne({ where: { phone: dto.phone } });
      if (!user) throw new NotFoundException('Foydalanuvchi topilmadi');
      const hashed = await bcrypt.hash(dto.newPassword, 10);
      await this.userRepo.update({ phone: dto.phone }, { password: hashed });
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'Parolni o‘zgartirishda serverda xatolik yuz berdi',
        error.message,
      );
    }
  }

  // async logout(userId: string) {
  //   // use undefined to satisfy TypeORM partial update typing
  //   await this.userRepo.update(userId, { hashedRefreshToken: undefined });
  //   return { message: 'Foydalanuvchi tizimdan chiqdi' };
  // }

  async logout(userId: string) {
  try {
    if (!userId) {
      throw new BadRequestException('Foydalanuvchi identifikatori talab qilinadi');
    }

    const result = await this.userRepo.update(
      { id: userId },
      { hashedRefreshToken: null }, // ✅ haqiqiy null qiymat
    );

    if (!result.affected || result.affected === 0) {
      throw new NotFoundException('Foydalanuvchi topilmadi');
    }

    return { message: 'Foydalanuvchi tizimdan muvaffaqiyatli chiqdi' };

  } catch (error) {
    if (error instanceof BadRequestException) throw error;
    if (error instanceof NotFoundException) throw error;

    throw new InternalServerErrorException(
      'Tizimdan chiqishda serverda xatolik yuz berdi',
    );
  }
}


  async refreshTokens(userId: string, refreshToken: string) {
    try {
      const user = await this.userRepo.findOne({ where: { id: userId } });
    
      if (!user?.hashedRefreshToken)
        throw new UnauthorizedException('Foydalanuvchi tizimdan chiqqan');

      const isMatch = await bcrypt.compare(
        refreshToken,
        user.hashedRefreshToken,
      );
      if (!isMatch) throw new UnauthorizedException('Refresh token noto‘g‘ri');

      const tokens = await this.getTokens(user);
      const hashedRefreshToken = await bcrypt.hash(tokens.refreshToken, 10);
      await this.userRepo.update(user.id, { hashedRefreshToken });

      return tokens;
    } catch (error) {
      if (error instanceof ForbiddenException) throw error;
      if (error instanceof UnauthorizedException) throw error;
      throw (
        new InternalServerErrorException(
          'Refresh token yangilashda serverda xatolik yuz berdi ',
        ),
        error.message
      );
    }
  }
}
