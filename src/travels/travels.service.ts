/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Travel } from './entities/travel.entity';
import { CreateTravelDto } from './dto/create-travel.dto';
import { UpdateTravelDto } from './dto/update-travel.dto';
import { TouristsService } from '../tourists/tourists.service';
import { UserRole } from '../users/entities/user.entity';

@Injectable()
export class TravelsService {
  constructor(
    @InjectRepository(Travel)
    private travelsRepository: Repository<Travel>,
    private touristsService: TouristsService,
  ) {}

  async create(createTravelDto: CreateTravelDto): Promise<Travel> {
    // Ensure the tourist exists
    await this.touristsService.findOne(createTravelDto.touristId);
    const travel = this.travelsRepository.create({
      ...createTravelDto,
      startDate: new Date(createTravelDto.startDate),
      endDate: new Date(createTravelDto.endDate),
    });
    return this.travelsRepository.save(travel);
  }

  async findAll(): Promise<Travel[]> {
    return this.travelsRepository.find();
  }

  async findOne(id: string): Promise<Travel> {
    const travel = await this.travelsRepository.findOne({
      where: { id },
      relations: ['tourist'],
    });
    if (!travel) {
      throw new NotFoundException(`Travel with ID ${id} not found`);
    }
    return travel;
  }

  async update(id: string, updateTravelDto: UpdateTravelDto): Promise<Travel> {
    const travel = await this.findOne(id);
    if (updateTravelDto.startDate) {
      travel.startDate = new Date(updateTravelDto.startDate);
    }
    if (updateTravelDto.endDate) {
      travel.endDate = new Date(updateTravelDto.endDate);
    }
    if (updateTravelDto.destination) {
      travel.destination = updateTravelDto.destination;
    }
    return this.travelsRepository.save(travel);
  }

  async remove(id: string): Promise<{ success: boolean; message: string }> {
    const travel = await this.findOne(id);
    await this.travelsRepository.remove(travel);
    return {
      success: true,
      message: `Travel with ID ${id} has been successfully deleted`,
    };
  }

  async findByTouristId(touristId: string): Promise<Travel[]> {
    return this.travelsRepository.find({ where: { touristId } });
  }

  async checkTravelAccess(
    travelId: string,
    userId: string,
    userRole: UserRole,
  ): Promise<boolean> {
    const travel = await this.findOne(travelId);
    // Employees can access all travels
    if (userRole === UserRole.EMPLOYEE) {
      return true;
    }
    // Tourists can only access their own travels
    const tourist = await this.touristsService.findByUserId(userId);
    if (!tourist) {
      return false;
    }
    return travel.touristId === tourist.id;
  }
}
