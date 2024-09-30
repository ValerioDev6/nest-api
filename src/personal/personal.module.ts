import { Module } from '@nestjs/common';
import { PersonalService } from './personal.service';
import { PersonalController } from './personal.controller';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prima.module';

@Module({
  controllers: [PersonalController],
  imports: [AuthModule, PrismaModule],
  providers: [PersonalService],
})
export class PersonalModule {}
