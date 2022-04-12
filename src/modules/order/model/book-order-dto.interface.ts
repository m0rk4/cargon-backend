import { IsArray, IsInt, IsPositive } from 'class-validator';

export class BookOrderDto {
  @IsInt()
  @IsPositive()
  driverId: number;

  @IsArray()
  @IsInt({ each: true })
  @IsPositive({ each: true })
  transportIds: number[];
}
