import { ValidateNested } from 'class-validator';
import { CreateLocationDto } from '../../location/model/create-location-dto.interface';

export class UpdateOrderLocations {
  @ValidateNested()
  fromLocation: CreateLocationDto;

  @ValidateNested()
  toLocation: CreateLocationDto;
}
