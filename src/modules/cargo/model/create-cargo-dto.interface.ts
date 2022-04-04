import { IsInt, IsPositive, IsString, Length } from 'class-validator';

export class CreateCargoDto {
  @IsInt()
  @IsPositive()
  weight: number;

  @IsInt()
  @IsPositive()
  length: number;

  @IsInt()
  @IsPositive()
  width: number;

  @IsInt()
  @IsPositive()
  height: number;

  @IsString()
  @Length(2, 50)
  name: string;
}
