import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prima.module';
import { TelefonoPersonalController } from './telefono-personal.controller';
import { TelefonoPersonalService } from './telefono-personal.service';

@Module({
  controllers: [TelefonoPersonalController],
  imports: [PrismaModule, AuthModule],
  providers: [TelefonoPersonalService],
})
export class TelefonoPersonalModule {}
