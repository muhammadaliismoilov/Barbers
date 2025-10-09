import { Controller, Post, Body, Patch, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RegisterDto, LoginDto, ChangePasswordDto } from './dto/auth.dto';
import type { Response } from 'express';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // RO‘YXATDAN O‘TISH
  @Post('register')
  @ApiOperation({ summary: 'Yangi foydalanuvchini ro‘yxatdan o‘tkazish' })
  @ApiResponse({
    status: 201,
    description: 'Foydalanuvchi muvaffaqiyatli ro‘yxatdan o‘tdi',
  })
  @ApiResponse({
    status: 409,
    description: 'Bu telefon raqami allaqachon ro‘yxatdan o‘tgan',
  })
  async register(@Body() dto: RegisterDto) {
    const user = await this.authService.register(dto);
    return { xabar: 'Foydalanuvchi muvaffaqiyatli ro‘yxatdan o‘tdi', user };
  }

  //TIZIMGA KIRISH ADMIN
   @Post('login/admin')
  @ApiOperation({ summary: 'Tizimga kiritish ' })
  @ApiResponse({
    status: 200,
    description: 'Tizimga muvaffaqiyatli kirildi, tokenlar qaytarildi',
  })
  @ApiResponse({
    status: 401,
    description: 'Telefon raqam yoki parol noto‘g‘ri',
  })
  async loginAdmin(@Body() dto: LoginDto, @Res() res: Response) {
    const result = await this.authService.loginAdmin(dto);

    res.cookie('access_token', result.accessToken, {
      httpOnly: true, // JS orqali o‘qib bo‘lmaydi
      secure: true, // faqat HTTPS’da ishlaydi
      sameSite: 'strict',
      maxAge: 1000 * 60 * 15, // 15 minut
    });

    res.cookie('refresh_token', result.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 kun
    });
    return res.json({
      xabar: 'Tizimga muvaffaqiyatli kirildi',
      user: result, // foydalanuvchi haqida ma’lumot qaytarish mumkin
    });
  }


  // TIZIMGA KIRISH BARBER
   @Post('login/barber')
  @ApiOperation({ summary: 'Tizimga kiritish ' })
  @ApiResponse({
    status: 200,
    description: 'Tizimga muvaffaqiyatli kirildi, tokenlar qaytarildi',
  })
  @ApiResponse({
    status: 401,
    description: 'Telefon raqam yoki parol noto‘g‘ri',
  })
  async loginBarber(@Body() dto: LoginDto, @Res() res: Response) {
    const result = await this.authService.loginBarber(dto);

    
    res.cookie('access_token', result.accessToken, {
      httpOnly: true, // JS orqali o‘qib bo‘lmaydi
      secure: true, // faqat HTTPS’da ishlaydi
      sameSite: 'strict',
      maxAge: 1000 * 60 * 15, // 15 minut
    });

    res.cookie('refresh_token', result.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 kun
    });
    return res.json({
      xabar: 'Tizimga muvaffaqiyatli kirildi',
      user: result, // foydalanuvchi haqida ma’lumot qaytarish mumkin
    });
  }


  // TIZIMGA KIRISH USER
  @Post('login/user')
  @ApiOperation({ summary: 'Tizimga kiritish ' })
  @ApiResponse({
    status: 200,
    description: 'Tizimga muvaffaqiyatli kirildi, tokenlar qaytarildi',
  })
  @ApiResponse({
    status: 401,
    description: 'Telefon raqam yoki parol noto‘g‘ri',
  })
  async login(@Body() dto: LoginDto, @Res() res: Response) {
    const result = await this.authService.login(dto);

    res.cookie('access_token', result.accessToken, {
      httpOnly: true, // JS orqali o‘qib bo‘lmaydi
      secure: true, // faqat HTTPS’da ishlaydi
      sameSite: 'strict',
      maxAge: 1000 * 60 * 15, // 15 minut
    });

    res.cookie('refresh_token', result.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 kun
    });
    return res.json({
      xabar: 'Tizimga muvaffaqiyatli kirildi',
      user: result, // foydalanuvchi haqida ma’lumot qaytarish mumkin
    });
  }


  // Parolni  o`zgartrish
  @Post('change-password')
  @ApiOperation({ summary: 'Parolni o‘zgartirish' })
  @ApiResponse({
    status: 200,
    description: 'Parol muvaffaqiyatli o‘zgartirildi',
  })
  @ApiResponse({ status: 404, description: 'Foydalanuvchi topilmadi' })
  async changePassword(@Body() dto: ChangePasswordDto) {
    await this.authService.changePassword(dto.phone, dto.newPassword);
    return { xabar: 'Parol muvaffaqiyatli o‘zgartirildi' };
  }

  @Post('logout')
  @ApiOperation({ summary: 'Tizimdan chiqish' })
  @ApiResponse({
    status: 200,
    description: 'Foydalanuvchi muvaffaqiyatli tizimdan chiqdi',
  })
  async logOut() {
    return this.authService.logOut();
  }
}
