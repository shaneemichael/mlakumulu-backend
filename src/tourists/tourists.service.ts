import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tourist } from './entities/tourist.entity';
import { CreateTouristDto } from './dto/create-tourist.dto';
import { UpdateTouristDto } from './dto/update-tourist.dto';
import { UserRole } from '../users/entities/user.entity';

@Injectable()
export class TouristsService {
  constructor(
    @InjectRepository(Tourist)
    private touristsRepository: Repository<Tourist>,
  ) {}

  async create(createTouristDto: CreateTouristDto): Promise<Tourist> {
    const tourist = this.touristsRepository.create(createTouristDto);
    return this.touristsRepository.save(tourist);
  }

  async findAll(): Promise<Tourist[]> {
    return this.touristsRepository.find();
  }

  async findOne(
    id: string,
    userId?: string,
    userRole?: UserRole,
  ): Promise<Tourist> {
    const tourist = await this.touristsRepository.findOne({
      where: { id },
      relations: ['travels'],
    });
    if (!tourist) {
      throw new NotFoundException(`Tourist with ID ${id} not found`);
    }
    // If user is a tourist, they can only see their own profile
    if (userRole === UserRole.TOURIST && tourist.userId !== userId) {
      throw new ForbiddenException('You can only view your own profile');
    }
    return tourist;
  }

  async update(
    id: string,
    updateTouristDto: UpdateTouristDto,
    userId?: string,
    userRole?: UserRole,
  ): Promise<Tourist> {
    const tourist = await this.findOne(id, userId, userRole);
    // If user is a tourist, they can only update their own profile
    if (userRole === UserRole.TOURIST && tourist.userId !== userId) {
      throw new ForbiddenException('You can only update your own profile');
    }
    Object.assign(tourist, updateTouristDto);
    return this.touristsRepository.save(tourist);
  }

  async remove(
    id: string,
    userId?: string,
    userRole?: UserRole,
  ): Promise<void> {
    const tourist = await this.findOne(id, userId, userRole);
    // If user is a tourist, they can't delete profiles
    if (userRole === UserRole.TOURIST) {
      throw new ForbiddenException('Tourists cannot delete profiles');
    }
    await this.touristsRepository.remove(tourist);
  }

  async findByUserId(userId: string): Promise<Tourist | undefined> {
    console.log('Looking for tourist with userId:', userId);

    const tourist = await this.touristsRepository.findOne({
      where: { userId },
      relations: ['travels'],
    });
    return tourist || undefined;
  }
}
