import { CreateLocationDto } from '../../location/model/create-location-dto.interface';

export interface UpdateOrderDto {
  fromLocation: CreateLocationDto;
  toLocation: CreateLocationDto;
}
