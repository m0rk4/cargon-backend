import { IsArray, IsInt, IsPositive } from 'class-validator';

export class BookOrderDto {
  @IsArray()
  @IsInt({ each: true })
  @IsPositive({ each: true })
  transportIds: number[];
}
