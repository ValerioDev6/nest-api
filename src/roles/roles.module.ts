import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { PrismaModule } from 'src/prisma/prima.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [RolesController],
  imports: [PrismaModule, AuthModule],
  providers: [RolesService],
})
export class RolesModule {}
