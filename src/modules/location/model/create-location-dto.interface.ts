import { CreateStreetDto } from './create-street-dto.interface';
import { CreateCityDto } from './create-city-dto.interface';

export interface CreateLocationDto {
  city: CreateCityDto;
  street: CreateStreetDto;
  home: number;
}
