import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ad } from './ad/ad.entity';
import { AdModule } from './ad/ad.module';
import { JobApplication } from './job-application/job-application.entity';
import { JobApplicationModule } from './job-application/job-application.module';
import { User } from './user/user.entity';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: process.env.DATABASE_NAME,
      synchronize: true,
      entities: [User, Ad, JobApplication]
    }),
    UserModule,
    AdModule,
    JobApplicationModule
  ],
  controllers: [],
})
export class AppModule {}
