import { Injectable, Response } from '@nestjs/common';
import { FileService } from './file.service';
import { StatisticService } from './statistic.service';

@Injectable()
export class ReportService {
  constructor(
    private statisticService: StatisticService,
    private fileService: FileService,
  ) {}

  async getTransportPopularity(
    type: string,
    @Response({ passthrough: true }) res,
  ) {
    const data =
      (await this.statisticService.getTransportPopularity()) as any[];
    switch (type) {
      case 'csv': {
        const header = [
          { id: 'type', title: 'Type' },
          { id: 'count', title: 'Count' },
        ];
        res.set({
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="file.csv"',
        });
        return this.fileService.getCsvReport(header, data);
      }
      case 'xlsx': {
        const header = ['Type', 'Count'];
        const transformedData = data.map((item) => {
          return [item.type, item.count];
        });
        res.set({
          'Content-Type':
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': 'attachment; filename="file.xlsx"',
        });
        return this.fileService.getXlsxReport(header, transformedData);
      }
      case 'pdf': {
        const header = [
          { label: 'Type', property: 'type' },
          { label: 'Count', property: 'count' },
        ];
        res.set({
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename="file.pdf"',
        });
        return this.fileService.getPdfReport(
          header,
          data,
          'Transport type popularity report',
        );
      }
    }
  }

  async getDriversStatistic(
    type: string,
    @Response({ passthrough: true }) res,
  ) {
    const data = (await this.statisticService.getDriversStatistic()) as any[];
    switch (type) {
      case 'csv': {
        const header = [
          { id: 'driver_id', title: 'Id' },
          { id: 'driver_surname', title: 'Surname' },
          { id: 'mileage', title: 'Km' },
        ];
        res.set({
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="file.csv"',
        });
        return this.fileService.getCsvReport(header, data);
      }
      case 'xlsx': {
        const header = ['Id', 'Surname', 'Km'];
        const transformedData = data.map((item) => {
          return [item.driver_id, item.driver_surname, item.mileage];
        });
        res.set({
          'Content-Type':
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': 'attachment; filename="file.xlsx"',
        });
        return this.fileService.getXlsxReport(header, transformedData);
      }
      case 'pdf': {
        const header = [
          { label: 'Id', property: 'driver_id' },
          { label: 'Surname', property: 'driver_surname' },
          { label: 'Km', property: 'mileage' },
        ];
        res.set({
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename="file.pdf"',
        });
        return this.fileService.getPdfReport(
          header,
          data,
          'Driver popularity report',
        );
      }
    }
  }

  async getOrdersTimeStatistic(
    type: string,
    @Response({ passthrough: true }) res,
  ) {
    let data = null;
    await this.statisticService.getOrdersTimeStatistic().then((response) => {
      data = [
        ReportService.dayOfWeek('Mon'),
        ReportService.dayOfWeek('Tue'),
        ReportService.dayOfWeek('Wed'),
        ReportService.dayOfWeek('Thu'),
        ReportService.dayOfWeek('Fri'),
        ReportService.dayOfWeek('Sat'),
        ReportService.dayOfWeek('Sun'),
      ];
      for (let i = 0; i < response.length; i++) {
        const item = response[i];
        data[item.day_of_week]['hour' + item.hour] = item.orders_count;
      }
    });
    switch (type) {
      case 'csv': {
        const header = [
          { id: 'day_of_week', title: 'Day' },
          { id: 'hour0', title: '0' },
          { id: 'hour1', title: '1' },
          { id: 'hour2', title: '2' },
          { id: 'hour3', title: '3' },
          { id: 'hour4', title: '4' },
          { id: 'hour5', title: '5' },
          { id: 'hour6', title: '6' },
          { id: 'hour7', title: '7' },
          { id: 'hour8', title: '8' },
          { id: 'hour9', title: '9' },
          { id: 'hour10', title: '10' },
          { id: 'hour11', title: '11' },
          { id: 'hour12', title: '12' },
          { id: 'hour13', title: '13' },
          { id: 'hour14', title: '14' },
          { id: 'hour15', title: '15' },
          { id: 'hour16', title: '16' },
          { id: 'hour17', title: '17' },
          { id: 'hour18', title: '18' },
          { id: 'hour19', title: '19' },
          { id: 'hour20', title: '20' },
          { id: 'hour21', title: '21' },
          { id: 'hour22', title: '22' },
          { id: 'hour23', title: '23' },
        ];
        res.set({
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="file.csv"',
        });
        return this.fileService.getCsvReport(header, data);
      }
      case 'xlsx': {
        const header = [
          'Day',
          '0',
          '1',
          '2',
          '3',
          '4',
          '5',
          '6',
          '7',
          '8',
          '9',
          '10',
          '11',
          '12',
          '13',
          '14',
          '15',
          '16',
          '17',
          '18',
          '19',
          '20',
          '21',
          '22',
          '23',
        ];
        const transformedData = data.map((item) => {
          return [
            item.day_of_week,
            item.hour0,
            item.hour1,
            item.hour2,
            item.hour3,
            item.hour4,
            item.hour5,
            item.hour6,
            item.hour7,
            item.hour8,
            item.hour9,
            item.hour10,
            item.hour11,
            item.hour12,
            item.hour13,
            item.hour14,
            item.hour15,
            item.hour16,
            item.hour17,
            item.hour18,
            item.hour19,
            item.hour20,
            item.hour21,
            item.hour22,
            item.hour23,
          ];
        });
        res.set({
          'Content-Type':
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': 'attachment; filename="file.xlsx"',
        });
        return this.fileService.getXlsxReport(header, transformedData);
      }
      case 'pdf': {
        const header = [
          { label: 'Day', property: 'day_of_week' },
          { label: '0', property: 'hour0' },
          { label: '1', property: 'hour1' },
          { label: '2', property: 'hour2' },
          { label: '3', property: 'hour3' },
          { label: '4', property: 'hour4' },
          { label: '5', property: 'hour5' },
          { label: '6', property: 'hour6' },
          { label: '7', property: 'hour7' },
          { label: '8', property: 'hour8' },
          { label: '9', property: 'hour9' },
          { label: '10', property: 'hour10' },
          { label: '11', property: 'hour11' },
          { label: '12', property: 'hour12' },
          { label: '13', property: 'hour13' },
          { label: '14', property: 'hour14' },
          { label: '15', property: 'hour15' },
          { label: '16', property: 'hour16' },
          { label: '17', property: 'hour17' },
          { label: '18', property: 'hour18' },
          { label: '19', property: 'hour19' },
          { label: '20', property: 'hour20' },
          { label: '21', property: 'hour21' },
          { label: '22', property: 'hour22' },
          { label: '23', property: 'hour23' },
        ];
        res.set({
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename="file.pdf"',
        });
        return this.fileService.getPdfReport(
          header,
          data,
          'Order time report',
          10,
          700,
        );
      }
    }
  }

  async getOrdersVolumes(type: string, @Response({ passthrough: true }) res) {
    const data = (await this.statisticService.getOrdersVolumes()) as any[];
    switch (type) {
      case 'csv': {
        const header = [
          { id: 'volume', title: 'Volume' },
          { id: 'weight', title: 'Weight' },
        ];
        res.set({
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="file.csv"',
        });
        return this.fileService.getCsvReport(header, data);
      }
      case 'xlsx': {
        const header = ['Volume', 'Weight'];
        const transformedData = data.map((item) => {
          return [item.volume, item.weight];
        });
        res.set({
          'Content-Type':
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': 'attachment; filename="file.xlsx"',
        });
        return this.fileService.getXlsxReport(header, transformedData);
      }
      case 'pdf': {
        const header = [
          { label: 'Volume', property: 'volume' },
          { label: 'Weight', property: 'weight' },
        ];
        res.set({
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename="file.pdf"',
        });
        return this.fileService.getPdfReport(
          header,
          data,
          'Orders volumes report',
        );
      }
    }
  }

  private static dayOfWeek(day: string) {
    return {
      day_of_week: day,
      hour0: 0,
      hour1: 0,
      hour2: 0,
      hour3: 0,
      hour4: 0,
      hour5: 0,
      hour6: 0,
      hour7: 0,
      hour8: 0,
      hour9: 0,
      hour10: 0,
      hour11: 0,
      hour12: 0,
      hour13: 0,
      hour14: 0,
      hour15: 0,
      hour16: 0,
      hour17: 0,
      hour18: 0,
      hour19: 0,
      hour20: 0,
      hour21: 0,
      hour22: 0,
      hour23: 0,
    };
  }
}
