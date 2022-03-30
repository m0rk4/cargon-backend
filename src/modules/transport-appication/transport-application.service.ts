import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { TransportApplicationStatus } from '@prisma/client';
import { HttpService } from '@nestjs/axios';
import { map, switchMap } from 'rxjs';

@Injectable()
export class TransportApplicationService {
  constructor(
    private prismaService: PrismaService,
    private httpService: HttpService,
  ) {}

  getPendingTransportApplications() {
    return this.prismaService.transportApplication.findMany({
      select: {
        id: true,
        documentPublicId: true,
        driver: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
      where: {
        status: TransportApplicationStatus.PENDING,
      },
    });
  }

  approveTransportApplication(id: number) {
    return this.changeTransportApplicationStatus(
      id,
      TransportApplicationStatus.APPROVED,
    );
  }

  rejectTransportApplication(id: number) {
    return this.changeTransportApplicationStatus(
      id,
      TransportApplicationStatus.CANCELLED,
    );
  }

  createTransportApplication(documentPublicId: string) {
    return this.prismaService.transportApplication.create({
      select: { id: true },
      data: {
        documentPublicId,
        driverId: 1,
      },
    });
  }

  getTransportApplicationDocument(documentPublicId: string) {
    return this.httpService
      .get<{ url: string }>(
        `https://api.cloudinary.com/v1_1/${process.env.CLOUD_NAME}/resources/image/upload/${documentPublicId}`,
        {
          headers: {
            Authorization: `Basic ${btoa(
              `${process.env.CLOUD_API_KEY}:${process.env.CLOUD_API_SECRET}`,
            )}`,
          },
        },
      )
      .pipe(
        switchMap(({ data: { url } }) => this.httpService.get<string>(url)),
        map(({ data }) => data),
      );
  }

  private changeTransportApplicationStatus(
    id: number,
    status: TransportApplicationStatus,
  ) {
    return this.prismaService.transportApplication.update({
      select: { id: true },
      where: { id },
      data: { status },
    });
  }
}
