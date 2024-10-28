import { Module } from '@nestjs/common';
import { ClienteService } from './cliente.service';
import { ClienteController } from './cliente.controller';
import { PrismaModule } from 'src/prisma/prima.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ClienteController],
  imports: [PrismaModule, AuthModule],
  providers: [ClienteService],
})
export class ClienteModule {}
