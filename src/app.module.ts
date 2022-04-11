import { Module } from '@nestjs/common';
import { TransportApplicationModule } from './modules/transport-appication/transport-application.module';
import { DriverApplicationModule } from './modules/driver-application/driver-application.module';
import { UserModule } from './modules/user/user.module';
import { OrderModule } from './modules/order/order.module';
import { LocationModule } from './modules/location/location.module';
import { ConfigModule } from '@nestjs/config';
import { CargoModule } from './modules/cargo/cargo.module';
import { VehicleModule } from './modules/vehicle/vehicle.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TransportApplicationModule,
    DriverApplicationModule,
    UserModule,
    OrderModule,
    LocationModule,
    CargoModule,
    VehicleModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
