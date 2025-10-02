// roles.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/users/user.entity';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
