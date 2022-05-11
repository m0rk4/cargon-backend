import { Module } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { StatisticService } from './statistic.service';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { FileService } from './file.service';

@Module({
  imports: [],
  controllers: [ReportController],
  providers: [PrismaService, StatisticService, FileService, ReportService],
})
export class StatisticModule {}
