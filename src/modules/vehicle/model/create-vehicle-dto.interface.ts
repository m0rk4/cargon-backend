import { VehicleType } from '@prisma/client';
import { CreateVehicleParametersDto } from './create-vehicle-parameters-dto.interface';

export interface CreateVehicleDto {
  driverId: number;
  yearOfProductionUNIX: number;
  brand: string;
  model: string;
  registrationNumber: string;
  vin: string;
  insuranceExpiryTsUNIX: number;
  vehicleType: VehicleType;
  parameters: CreateVehicleParametersDto;
}
