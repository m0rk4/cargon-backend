import { Module } from '@nestjs/common';
import { TransportApplicationModule } from './transport-appication/transport-application.module';

@Module({
  imports: [TransportApplicationModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
