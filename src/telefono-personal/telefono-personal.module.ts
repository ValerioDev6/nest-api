import { Module } from '@nestjs/common';
import { TelefonoPersonalService } from './telefono-personal.service';
import { TelefonoPersonalController } from './telefono-personal.controller';

@Module({
  controllers: [TelefonoPersonalController],
  providers: [TelefonoPersonalService],
})
export class TelefonoPersonalModule {}
