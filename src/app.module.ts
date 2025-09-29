import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

import { BarberServicesModule } from './barber_services/barber_services.module';
import { ReportsModule } from './reports/reports.module';
import { ClientsModule } from './clients/clients.module';

import { BarbersModule } from './barbers/barbers.module';

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
    AuthModule,
    UsersModule,
       BarbersModule,
    BarberServicesModule,
    ClientsModule,
 

    // ReportsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
