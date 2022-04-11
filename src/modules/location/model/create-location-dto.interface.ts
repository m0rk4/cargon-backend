import { CreateStreetDto } from './create-street-dto.interface';
import { CreateCityDto } from './create-city-dto.interface';
import { IsInt, IsPositive, ValidateNested } from 'class-validator';

export class CreateLocationDto {
  @ValidateNested()
  city: CreateCityDto;

  @ValidateNested()
  street: CreateStreetDto;

  @IsInt()
  @IsPositive()
  home: number;
}
