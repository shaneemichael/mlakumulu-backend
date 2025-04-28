import { IsDateString, IsNotEmpty, IsObject, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTravelDto {
  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  endDate: string;

  @ApiProperty()
  @IsObject()
  @IsNotEmpty()
  destination: any;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  touristId: string;
}
