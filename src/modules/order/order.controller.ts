import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './model/create-order-dto.interface';
import { UpdateOrderDto } from './model/update-order-dto.interface';

@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Get('pending')
  async getPendingOrders() {
    return this.orderService.getPendingOrders();
  }

  @Get('user-orders/:user_id')
  async getUserOrders(@Param('user_id') user_id: string) {
    return this.orderService.getUserOrders(+user_id);
  }

  @Get(':id')
  async getOrder(@Param('id') id: string) {
    return this.orderService.getOrder(+id);
  }

  @Put(':id/approve')
  async approveOrder(@Param('id') id: string) {
    return this.orderService.approveOrder(+id);
  }

  @Put(':id/decline')
  async declineOrder(@Param('id') id: string) {
    return this.orderService.declineOrder(+id);
  }

  @Put(':id/book/:driverId')
  async bookOrder(
    @Param('id') id: string,
    @Param('driverId') driverId: string,
  ) {
    return this.orderService.bookOrder(+id, +driverId);
  }

  @Put(':id/release')
  async releaseOrder(@Param('id') id: string) {
    return this.orderService.releaseOrder(+id);
  }

  @Put(':id/complete')
  async completeOrder(@Param('id') id: string) {
    return this.orderService.completeOrder(+id);
  }

  @Put(':id')
  async updateOrder(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.orderService.updateOrder(+id, updateOrderDto);
  }

  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.createOrder(createOrderDto);
  }
}
