import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { userLoginDto, userRegisterDto } from 'src/dtos/user.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { LocalAuthGuard } from 'src/guards/local-auth.guard';

@Controller('api')
export class UserController {
  constructor(private readonly authService: AuthService) {}
  @Post('/register')
  register(@Body() user: userRegisterDto) {
    return this.authService.register(user);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Body() user: userLoginDto) {
    return this.authService.login(user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('users/me')
  getProfile(@Request() req) {
    return req.user;
  }
}
