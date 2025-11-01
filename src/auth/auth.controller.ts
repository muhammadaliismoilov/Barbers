// import { Controller, Post, Body, Patch, Res, UseGuards, Req } from '@nestjs/common';
// import { AuthService } from './auth.service';
// import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
// import { RegisterDto, LoginDto, ChangePasswordDto } from './dto/auth.dto';
// import type { Request, Response } from 'express';
// import { JwtAuthGuard } from 'src/common/guard/jwt.aut.guard';
// import { JwtService } from '@nestjs/jwt';

// @ApiTags('Auth')
// export class AuthController {
//   constructor(private readonly authService: AuthService, private readonly jwtService: JwtService) {}
//   // constructor(private readonly authService: AuthService) {}

//   // RO‘YXATDAN O‘TISH
//   @Post('register')
//   @ApiOperation({ summary: 'Yangi foydalanuvchini ro‘yxatdan o‘tkazish' })
//   @ApiResponse({
//     status: 201,
//     description: 'Foydalanuvchi muvaffaqiyatli ro‘yxatdan o‘tdi',
//   })
//   @ApiResponse({
//     status: 409,
//     description: 'Bu telefon raqami allaqachon ro‘yxatdan o‘tgan',
//   })
//   async register(@Body() dto: RegisterDto) {
//     const user = await this.authService.register(dto);
//     return { xabar: 'Foydalanuvchi muvaffaqiyatli ro‘yxatdan o‘tdi', user };
//   }

//   // TIZIMGA KIRISH ADMIN
//    @Post('login/admin')
//   @ApiOperation({ summary: 'Tizimga kiritish ' })
//   @ApiResponse({
//     status: 200,
//     description: 'Tizimga muvaffaqiyatli kirildi, tokenlar qaytarildi',
//   })
//   @ApiResponse({
//     status: 401,
//     description: 'Telefon raqam yoki parol noto‘g‘ri',
//   })
//   async loginAdmin(@Body() dto: LoginDto, @Res() res: Response) {
//     const result = await this.authService.loginAdmin(dto);

//     res.cookie('access_token', result.accessToken, {
//       httpOnly: true, // JS orqali o‘qib bo‘lmaydi
//       secure: true, // faqat HTTPS’da ishlaydi
//       sameSite: 'strict',
//       maxAge: 1000 * 60 * 15, // 15 minut
//     });

//     res.cookie('refresh_token', result.refreshToken, {
//       httpOnly: true,
//       secure: true,
//       sameSite: 'strict',
//       maxAge: 1000 * 60 * 60 * 24 * 7, // 7 kun
//     });
//     return res.json({
//       xabar: 'Tizimga muvaffaqiyatli kirildi',
//       user: result, // foydalanuvchi haqida ma’lumot qaytarish mumkin
//     });
//   }

//   // TIZIMGA KIRISH BARBER
//    @Post('login/barber')
//   @ApiOperation({ summary: 'Tizimga kiritish ' })
//   @ApiResponse({
//     status: 200,
//     description: 'Tizimga muvaffaqiyatli kirildi, tokenlar qaytarildi',
//   })
//   @ApiResponse({
//     status: 401,
//     description: 'Telefon raqam yoki parol noto‘g‘ri',
//   })
//   async loginBarber(@Body() dto: LoginDto, @Res() res: Response) {
//     const result = await this.authService.loginBarber(dto);

//     res.cookie('access_token', result.accessToken, {
//       httpOnly: true, // JS orqali o‘qib bo‘lmaydi
//       secure: true, // faqat HTTPS’da ishlaydi
//       sameSite: 'strict',
//       maxAge: 1000 * 60 * 15, // 15 minut
//     });

//     res.cookie('refresh_token', result.refreshToken, {
//       httpOnly: true,
//       secure: true,
//       sameSite: 'strict',
//       maxAge: 1000 * 60 * 60 * 24 * 7, // 7 kun
//     });
//     return res.json({
//       xabar: 'Tizimga muvaffaqiyatli kirildi',
//       user: result, // foydalanuvchi haqida ma’lumot qaytarish mumkin
//     });
//   }

//   // TIZIMGA KIRISH USER
//   @Post('login/user')
//   @ApiOperation({ summary: 'Tizimga kiritish ' })
//   @ApiResponse({
//     status: 200,
//     description: 'Tizimga muvaffaqiyatli kirildi, tokenlar qaytarildi',
//   })
//   @ApiResponse({
//     status: 401,
//     description: 'Telefon raqam yoki parol noto‘g‘ri',
//   })
//  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
//     const user = await this.authService.login(dto);
//     // Cookie orqali tokenlarni yuborish
//     // const isProd = process.env.NODE_ENV === 'production';
//     res.cookie('access_token', user.accessToken, {
//       httpOnly: true,
//       // secure: isProd, // production’da true, localda false
//       sameSite: 'strict',
//       maxAge: 1000 * 60 * 15, // 15 daqiqa
//     });
//     res.cookie('refresh_token', user.refreshToken, {
//       httpOnly: true,
//       // secure: isProd,
//       sameSite: 'strict',
//       maxAge: 1000 * 60 * 60 * 24 * 7, // 7 kun
//     });

//     return {
//       message: 'Tizimga muvaffaqiyatli kirildi',
//      user
//     };
//   }

//   // Parolni  o`zgartrish
//   @Post('change-password')
//   @ApiOperation({ summary: 'Parolni o‘zgartirish' })
//   @ApiResponse({
//     status: 200,
//     description: 'Parol muvaffaqiyatli o‘zgartirildi',
//   })
//   @ApiResponse({ status: 404, description: 'Foydalanuvchi topilmadi' })
//   async changePassword(@Body() dto: ChangePasswordDto) {
//     await this.authService.changePassword(dto);
//     return { xabar: 'Parol muvaffaqiyatli o‘zgartirildi' };
//   }

//   //Tizimdan chiqish

//   @Post('logout')
//   @UseGuards(JwtAuthGuard)
//   // Add the missing @Controller decorator and remove the extra brace. Patch below.

//   @ApiOperation({ summary: 'Tizimdan chiqish' })
//   @ApiResponse({
//     status: 200,
//     description: 'Foydalanuvchi muvaffaqiyatli tizimdan chiqdi',
//   })
//   async logout(@Req() req: any, @Res({ passthrough: true }) res: Response) {
//     const userId = req.user.sub;

//     await this.authService.logout(userId);

//     res.clearCookie('access_token');
//     res.clearCookie('refresh_token');

//     return { message: 'Tizimdan muvaffaqiyatli chiqildi' };
//   }
//   // 🔁 REFRESH TOKEN
//   @Post('refresh')
//   async refresh(@Req() req: Request & { cookies?: { refresh_token?: string } }, @Res({ passthrough: true }) res: Response) {
//     const refreshToken = req.cookies?.refresh_token;
//     if (!refreshToken) throw new Error('Refresh token topilmadi');

//     const decoded = this.jwtService.verify(refreshToken, {
//       secret: process.env.JWT_REFRESH_SECRET || 'refresh_secret',
//     });

//     const tokens = await this.authService.refreshTokens(decoded.sub, refreshToken);

//     res.cookie('access_token', tokens.accessToken, {
//       httpOnly: true,
//       secure: true,
//       sameSite: 'strict',
//       maxAge: 1000 * 60 * 15,
//     });

//     res.cookie('refresh_token', tokens.refreshToken, {
//       httpOnly: true,
//       secure: true,
//       sameSite: 'strict',
//       maxAge: 1000 * 60 * 60 * 24 * 7,
//     });

//     return { message: 'Tokenlar yangilandi' };
//   }
//   }

// ...existing code...
import {
  Controller,
  Post,
  Body,
  Res,
  UseGuards,
  Req,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RegisterDto, LoginDto, ChangePasswordDto } from './dto/auth.dto';
import type { Request, Response } from 'express';
import { JwtAuthGuard } from 'src/common/guard/jwt.aut.guard';
import { JwtService } from '@nestjs/jwt';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

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

  // TIZIMGA KIRISH ADMIN
  @Post('login/admin')
  @ApiOperation({ summary: 'Tizimga kiritish Admin' })
  @ApiResponse({
    status: 200,
    description: 'Tizimga muvaffaqiyatli kirildi, tokenlar qaytarildi',
  })
  @ApiResponse({
    status: 401,
    description: 'Telefon raqam yoki parol noto‘g‘ri',
  })
  async loginAdmin(@Body() dto: LoginDto, @Res() res: Response) {
    const user = await this.authService.loginAdmin(dto);

    const isProd = process.env.NODE_ENV === 'production';
    const sameSite = isProd ? 'none' : 'strict'; // cross-site in prod requires 'none' + secure:true
    const secure = isProd; // local dev: secure=false so cookie is sent over http

    res.cookie('access_token', user.accessToken, {
      httpOnly: true,
      secure,
      sameSite,
      maxAge: 1000 * 60 * 15,
    });
    res.cookie('refresh_token', user.refreshToken, {
      httpOnly: true,
      secure,
      sameSite,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    return res.json({
      xabar: 'Tizimga muvaffaqiyatli kirildi',
      user,
    });
  }

  // TIZIMGA KIRISH BARBER
  @Post('login/barber')
  @ApiOperation({ summary: 'Tizimga kiritish Barber' })
  @ApiResponse({
    status: 200,
    description: 'Tizimga muvaffaqiyatli kirildi, tokenlar qaytarildi',
  })
  @ApiResponse({
    status: 401,
    description: 'Telefon raqam yoki parol noto‘g‘ri',
  })
  async loginBarber(@Body() dto: LoginDto, @Res() res: Response) {
    const user = await this.authService.loginBarber(dto);

    const isProd = process.env.NODE_ENV === 'production';
    const sameSite = isProd ? 'none' : 'strict'; // cross-site in prod requires 'none' + secure:true
    const secure = isProd; // local dev: secure=false so cookie is sent over http

    res.cookie('access_token', user.accessToken, {
      httpOnly: true,
      secure,
      sameSite,
      maxAge: 1000 * 60 * 15,
    });
    res.cookie('refresh_token', user.refreshToken, {
      httpOnly: true,
      secure,
      sameSite,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    return res.json({
      xabar: 'Tizimga muvaffaqiyatli kirildi',
      user,
    });
  }

  // TIZIMGA KIRISH USER
  @Post('login/user')
  @ApiOperation({ summary: 'Tizimga kiritish User' })
  @ApiResponse({
    status: 200,
    description: 'Tizimga muvaffaqiyatli kirildi, tokenlar qaytarildi',
  })
  @ApiResponse({
    status: 401,
    description: 'Telefon raqam yoki parol noto‘g‘ri',
  })
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.loginUser(dto);

    const isProd = process.env.NODE_ENV === 'production';
    const sameSite = isProd ? 'none' : 'strict'; // cross-site in prod requires 'none' + secure:true
    const secure = isProd; // local dev: secure=false so cookie is sent over http

    res.cookie('access_token', user.accessToken, {
      httpOnly: true,
      secure,
      sameSite,
      maxAge: 1000 * 60 * 15,
    });
    res.cookie('refresh_token', user.refreshToken, {
      httpOnly: true,
      secure,
      sameSite,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return {
      message: 'Tizimga muvaffaqiyatli kirildi',
      user,
    };
  }

  // Parolni o`zgartirish
  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Parolni o‘zgartirish' })
  @ApiResponse({
    status: 200,
    description: 'Parol muvaffaqiyatli o‘zgartirildi',
  })
  @ApiResponse({ status: 404, description: 'Foydalanuvchi topilmadi' })
  async changePassword(@Body() dto: ChangePasswordDto) {
    await this.authService.changePassword(dto);
    return { xabar: 'Parol muvaffaqiyatli o‘zgartirildi' };
  }

  // Tizimdan chiqish
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Tizimdan chiqish' })
  @ApiResponse({
    status: 200,
    description: 'Foydalanuvchi muvaffaqiyatli tizimdan chiqdi',
  })
  async logout(@Req() req: any, @Res({ passthrough: true }) res: Response) {
    const userId = req.user?.id;
    if (!userId) {
      throw new BadRequestException('Not authenticated');
    }
    await this.authService.logout(userId);
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');

    return { message: 'Tizimdan muvaffaqiyatli chiqildi' };
  }

  // 🔁 REFRESH TOKEN
  @Post('refresh')
  @ApiOperation({ summary: 'Reresh tokenni yangilash' })
  async refresh(
    @Req() req: Request & { cookies?: { refresh_token?: string } },
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const refreshToken = req.cookies?.refresh_token;
      if (!refreshToken) throw new NotFoundException('Refresh token topilmadi');

      const decoded = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || 'refresh_secret',
      });

      const tokens = await this.authService.refreshTokens(
        decoded.sub,
        refreshToken,
      );

      res.cookie('access_token', tokens.accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 1000 * 60 * 15,
      });

      res.cookie('refresh_token', tokens.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });

      return { message: 'Tokenlar yangilandi' };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw (
        new InternalServerErrorException(
          'Refresh token yangilashda serverda xatolik yuzb berdi',
        ),
        error.message
      );
    }
  }
}

