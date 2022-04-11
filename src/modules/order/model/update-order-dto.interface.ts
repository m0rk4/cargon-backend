import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order-dto.interface';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {}
