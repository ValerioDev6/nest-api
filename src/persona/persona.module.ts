import { Module } from '@nestjs/common';
import { PersonaService } from './persona.service';
import { PersonaController } from './persona.controller';
import { PrismaModule } from 'src/prisma/prima.module';
import { AuthModule } from 'src/auth/auth.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [PersonaController],
  imports: [PrismaModule, AuthModule, HttpModule],
  providers: [PersonaService],
})
export class PersonaModule {}
