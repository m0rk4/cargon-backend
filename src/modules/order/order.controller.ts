import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './model/create-order-dto.interface';
import { UpdateOrderDto } from './model/update-order-dto.interface';
import { BookOrderDto } from './model/book-order-dto.interface';
import { GetCurrentUserId } from '../../shared/decorators';

@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Get('pending')
  async getPendingOrders() {
    return this.orderService.getPendingOrders();
  }

  @Get('approved')
  async getApprovedOrders() {
    return this.orderService.getApprovedOrders();
  }

  @Get('user-orders')
  async getUserOrders(@GetCurrentUserId() userId: number) {
    return this.orderService.getUserOrders(userId);
  }

  @Get('driver-orders')
  async getDriverOrders(@GetCurrentUserId() driverId: number) {
    return this.orderService.getDriverOrders(driverId);
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

  @Put(':id/book')
  async bookOrder(
    @Param('id') id: string,
    @GetCurrentUserId() driverId: number,
    @Body() bookOrderDto: BookOrderDto,
  ) {
    return this.orderService.bookOrder(+id, driverId, bookOrderDto);
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
  async createOrder(
    @GetCurrentUserId() ownerId: number,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    return this.orderService.createOrder(ownerId, createOrderDto);
  }
}
