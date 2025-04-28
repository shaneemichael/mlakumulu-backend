/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { TravelsService } from './travels.service';
import { CreateTravelDto } from './dto/create-travel.dto';
import { UpdateTravelDto } from './dto/update-travel.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TouristsService } from '../tourists/tourists.service';

@ApiTags('travels')
@Controller('travels')
export class TravelsController {
  constructor(
    private readonly travelsService: TravelsService,
    private readonly touristsService: TouristsService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.EMPLOYEE, UserRole.TOURIST)
  @ApiBearerAuth()
  create(@Body() createTravelDto: CreateTravelDto) {
    return this.travelsService.create(createTravelDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.EMPLOYEE, UserRole.TOURIST)
  @ApiBearerAuth()
  findAll() {
    return this.travelsService.findAll();
  }

  @Get('my-travels')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async findMyTravels(@Request() req) {
    if (req.user.role === UserRole.EMPLOYEE) {
      return this.travelsService.findAll();
    }
    console.log('Request user:', req.user); // Detailed user info
    console.log('User ID:', req.user.id);
    console.log('User role:', req.user.role);
    const tourist = await this.touristsService.findByUserId(req.user.id);
    if (!tourist) {
      throw new ForbiddenException('Tourist profile not found');
    }
    return this.travelsService.findByTouristId(tourist.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async findOne(@Param('id') id: string, @Request() req) {
    const hasAccess = await this.travelsService.checkTravelAccess(
      id,
      req.user.id,
      req.user.role,
    );
    if (!hasAccess) {
      throw new ForbiddenException('You do not have access to this travel');
    }
    return this.travelsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.EMPLOYEE)
  @ApiBearerAuth()
  async update(
    @Param('id') id: string,
    @Body() updateTravelDto: UpdateTravelDto,
  ) {
    return this.travelsService.update(id, updateTravelDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.EMPLOYEE)
  @ApiBearerAuth()
  async remove(@Param('id') id: string) {
    await this.travelsService.remove(id);
    return { message: 'Travel deleted successfully' };
  }
}
