import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RegisterDto, LoginDto } from './dto/auth.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // RO‘YXATDAN O‘TISH
  @Post('register')
  @ApiOperation({ summary: 'Yangi foydalanuvchini ro‘yxatdan o‘tkazish' })
  @ApiResponse({ status: 201, description: 'Foydalanuvchi muvaffaqiyatli ro‘yxatdan o‘tdi' })
  @ApiResponse({ status: 409, description: 'Bu telefon raqami allaqachon ro‘yxatdan o‘tgan' })
  async register(@Body() dto: RegisterDto) {
    const user = await this.authService.register(dto);
    return { xabar: 'Foydalanuvchi muvaffaqiyatli ro‘yxatdan o‘tdi', user };
  }

  // TIZIMGA KIRISH
  @Post('login')
  @ApiOperation({ summary: 'Tizimga kiritish ' })
  @ApiResponse({ status: 200, description: 'Tizimga muvaffaqiyatli kirildi, tokenlar qaytarildi' })
  @ApiResponse({ status: 401, description: 'Telefon raqam yoki parol noto‘g‘ri' })
  
  async login(@Body() dto: LoginDto) {
    const result = await this.authService.login(dto);
    return { xabar: 'Tizimga muvaffaqiyatli kirildi', ...result };
  }
}
