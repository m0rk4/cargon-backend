import { Controller, Get, Render } from '@nestjs/common';
import { StatisticService } from './statistic.service';

@Controller('statistic')
export class StatisticController {
  private days_of_week = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  private days = Array.from(Array(7).keys());
  private hours = Array.from(Array(24).keys());
  constructor(private statisticService: StatisticService) {}

  @Get('transport-popularity')
  @Render('transport-popularity')
  async getTransportPopularity() {
    return { statistic: await this.statisticService.getTransportPopularity() };
  }

  @Get('drivers')
  @Render('drivers-statistic')
  async getDriversStatistic() {
    const statistic = await this.statisticService.getDriversStatistic();
    return {
      headers: Object.keys(statistic[0]),
      statistic,
    };
  }

  @Get('orders-volumes')
  @Render('orders-volumes')
  async getOrdersVolumes() {
    return { statistic: await this.statisticService.getOrdersVolumes() };
  }

  @Get('orders-time')
  @Render('orders-time')
  async getOrdersTimeStatistic() {
    const data = await this.statisticService.getOrdersTimeStatistic();
    const statistic = Array(7);
    this.days.forEach((day) => {
      statistic[day] = {
        day: this.days_of_week[day],
        data: Array(24),
      };
      this.hours.forEach((hour) => {
        statistic[day].data[hour] =
          data.find((el) => el.day_of_week == day && el.hour == hour)
            ?.orders_count || 0;
      });
    });
    return {
      hours: this.hours,
      statistic,
    };
  }
}
