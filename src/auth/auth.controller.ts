import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UserRole } from '../users/entities/user.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register/tourist')
  async registerTourist(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto, UserRole.TOURIST);
  }

  @Post('register/employee')
  async registerEmployee(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto, UserRole.EMPLOYEE);
  }
}
