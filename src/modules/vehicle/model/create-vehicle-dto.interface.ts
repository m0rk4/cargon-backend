import { VehicleType } from '@prisma/client';
import { CreateVehicleParametersDto } from './create-vehicle-parameters-dto.interface';
import {
  IsEnum,
  IsInt,
  IsPositive,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';

export class CreateVehicleDto {
  @IsInt()
  @IsPositive()
  driverId: number;

  @IsInt()
  @IsPositive()
  yearOfProductionUNIX: number;

  @IsString()
  @Length(1, 50)
  brand: string;

  @IsString()
  @Length(1, 50)
  model: string;

  @IsString()
  @Length(7, 7)
  registrationNumber: string;

  @IsString()
  @Length(17, 17)
  vin: string;

  @IsInt()
  @IsPositive()
  insuranceExpiryTsUNIX: number;

  @IsEnum(VehicleType)
  vehicleType: VehicleType;

  @ValidateNested()
  parameters: CreateVehicleParametersDto;
}
