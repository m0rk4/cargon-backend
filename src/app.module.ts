import { Module } from '@nestjs/common';
import { TransportApplicationModule } from './modules/transport-appication/transport-application.module';
import { DriverApplicationModule } from './modules/driver-application/driver-application.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [TransportApplicationModule, DriverApplicationModule, UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
