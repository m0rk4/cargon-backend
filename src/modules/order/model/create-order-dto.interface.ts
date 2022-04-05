import { CreateLocationDto } from '../../location/model/create-location-dto.interface';
import { CreateCargoDto } from '../../cargo/model/create-cargo-dto.interface';
import {
  ArrayNotEmpty,
  IsInt, IsOptional,
  IsPositive,
  ValidateNested,
} from 'class-validator';

export class CreateOrderDto {
  @IsInt()
  @IsPositive()
  userId: number;

  @ValidateNested()
  fromLocation: CreateLocationDto;

  @ValidateNested()
  toLocation: CreateLocationDto;

  @ArrayNotEmpty()
  @ValidateNested()
  cargos: CreateCargoDto[];

  @IsOptional()
  @IsInt({ each: true })
  @IsPositive({ each: true })
  transportIds?: number[];
}
