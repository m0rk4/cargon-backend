import {
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Length,
} from 'class-validator';

export class CreateCityDto {
  @IsOptional()
  @IsInt()
  @IsPositive()
  id?: number;

  @IsString()
  @Length(2, 50)
  name: string;
}
