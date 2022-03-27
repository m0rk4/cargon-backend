import { Controller, Get, Param, Put } from '@nestjs/common';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Get('not-approved')
  async getNotApprovedOrders() {
    return this.orderService.getNotApprovedOrders();
  }

  @Put(':id/approve')
  async approveOrder(@Param('id') id: string) {
    return this.orderService.approveOrder(+id);
  }
}
