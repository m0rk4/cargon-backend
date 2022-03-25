import { Module } from '@nestjs/common';
import { TransportApplicationModule } from './transport-appication/transport-application.module';
import { DriverApplicationModule } from './driver-application/driver-application.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [TransportApplicationModule, DriverApplicationModule, UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
