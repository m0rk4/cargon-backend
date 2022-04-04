import { IsInt, IsPositive, IsString, Length } from 'class-validator';

export class CreateCityDto {
  @IsInt()
  @IsPositive()
  id?: number;

  @IsString()
  @Length(2, 50)
  name: string;
}
