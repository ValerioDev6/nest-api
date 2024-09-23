import { Module } from '@nestjs/common';
import { PersonalService } from './personal.service';
import { PersonalController } from './personal.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [PersonalController],
  imports: [AuthModule],
  providers: [PersonalService],
})
export class PersonalModule {}
