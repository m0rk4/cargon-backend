import { IsInt, IsPositive } from 'class-validator';

export class CreateVehicleParametersDto {
  @IsInt()
  @IsPositive()
  width: number;

  @IsInt()
  @IsPositive()
  height: number;

  @IsInt()
  @IsPositive()
  length: number;

  @IsInt()
  @IsPositive()
  capacity: number;

  @IsInt()
  @IsPositive()
  mileage: number;
}
