import { Module } from '@nestjs/common';
import { CategorieService } from './categorie.service';
import { CategorieController } from './categorie.controller';
import { PrismaModule } from 'src/prisma/prima.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [CategorieController],
  imports: [PrismaModule, AuthModule],
  providers: [CategorieService],
})
export class CategorieModule {}
