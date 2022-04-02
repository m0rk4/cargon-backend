import { CreateLocationDto } from '../../location/model/create-location-dto.interface';
import { CreateCargoDto } from '../../cargo/model/create-cargo-dto.interface';

export interface CreateOrderDto {
  userId: number;
  fromLocation: CreateLocationDto;
  toLocation: CreateLocationDto;
  cargos: CreateCargoDto[];
  transportIds: number[];
}
