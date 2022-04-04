import { PartialType } from '@nestjs/mapped-types';
import { CreateCargoDto } from './create-cargo-dto.interface';

export class UpdateCargoDto extends PartialType(CreateCargoDto) {}
