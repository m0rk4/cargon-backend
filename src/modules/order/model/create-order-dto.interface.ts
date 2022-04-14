import { CreateLocationDto } from '../../location/model/create-location-dto.interface';
import { CreateCargoDto } from '../../cargo/model/create-cargo-dto.interface';
import { ArrayNotEmpty, ValidateNested } from 'class-validator';

export class CreateOrderDto {
  @ValidateNested()
  fromLocation: CreateLocationDto;

  @ValidateNested()
  toLocation: CreateLocationDto;

  @ArrayNotEmpty()
  @ValidateNested()
  cargos: CreateCargoDto[];
}
