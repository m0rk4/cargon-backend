import { Module } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { StatisticController } from './statistic.controller';
import { StatisticService } from './statistic.service';

@Module({
  imports: [],
  controllers: [StatisticController],
  providers: [PrismaService, StatisticService],
})
export class StatisticModule {}
