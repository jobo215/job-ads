import { Module } from '@nestjs/common';
import { JobApplicationService } from './job-application.service';
import { JobApplicationController } from './job-application.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobApplication } from './job-application.entity';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { AdModule } from 'src/ad/ad.module';
import { AdService } from 'src/ad/ad.service';
import { CurrentUserInterceptor } from 'src/interceptors/current-user.interceptor';

@Module({
  imports: [TypeOrmModule.forFeature([JobApplication]), UserModule, AdModule],
  providers: [JobApplicationService, UserService, AdService],
  controllers: [JobApplicationController, CurrentUserInterceptor]
})
export class JobApplicationModule {}
