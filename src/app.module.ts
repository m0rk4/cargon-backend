import { Module } from '@nestjs/common';
import { TransportApplicationModule } from './modules/transport-appication/transport-application.module';
import { DriverApplicationModule } from './modules/driver-application/driver-application.module';
import { UserModule } from './modules/user/user.module';
import { OrderModule } from './modules/order/order.module';
import { LocationModule } from './modules/location/location.module';
import { ConfigModule } from '@nestjs/config';
import { CargoModule } from './modules/cargo/cargo.module';
import { VehicleModule } from './modules/vehicle/vehicle.module';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from './shared/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { AtGuard } from './shared/guards';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    PrismaModule,
    TransportApplicationModule,
    DriverApplicationModule,
    UserModule,
    OrderModule,
    LocationModule,
    CargoModule,
    VehicleModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
  ],
})
export class AppModule {}
