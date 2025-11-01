import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { BarberServicesModule } from './barber_services/barber_services.module';
import { ReportsModule } from './reports/reports.module';
import { ClientsModule } from './clients/clients.module';
import { QueuesModule } from './queues/queues.module';
import { UsersInfoModule } from './users_info/users_info.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TransformInterceptor } from './common/interseptors/transform.interceptor';
import { ErrorInterceptor } from './common/interseptors/error.interseptor';
import { BullModule } from '@nestjs/bull';


@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.DB_HOST,
        port: process.env.DB_PORT
          ? parseInt(process.env.DB_PORT, 10)
          : undefined,
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    // ClientsQueueModule,
    AuthModule,
    UsersModule,
    UsersInfoModule,
    BarberServicesModule,
    ClientsModule,
    ReportsModule,
    QueuesModule,
    UsersInfoModule,
  ],
  providers: [
  ],

})
export class AppModule {}
