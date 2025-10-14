import { Module } from '@nestjs/common';
import { UsersInfoService } from './users_info.service';
import { UsersInfoController } from './users_info.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersInfo } from './users_info.entity';
import { Users } from 'src/users/user.entity';

@Module({
  imports:[TypeOrmModule.forFeature([UsersInfo,Users])],
  controllers: [UsersInfoController],
  providers: [UsersInfoService],
})
export class UsersInfoModule {}
