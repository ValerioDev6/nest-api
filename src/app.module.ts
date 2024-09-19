import { Module } from '@nestjs/common';
import { CategorieModule } from './categorie/categorie.module';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [CategorieModule, AuthModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
