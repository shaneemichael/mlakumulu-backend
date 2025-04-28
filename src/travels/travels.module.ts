import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Travel } from './entities/travel.entity';
import { TravelsService } from './travels.service';
import { TravelsController } from './travels.controller';
import { TouristsModule } from '../tourists/tourists.module';
@Module({
  imports: [TypeOrmModule.forFeature([Travel]), TouristsModule],
  controllers: [TravelsController],
  providers: [TravelsService],
})
export class TravelsModule {}
