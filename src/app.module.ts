import { Module } from '@nestjs/common';
import { CategorieModule } from './categorie/categorie.module';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { PersonalModule } from './personal/personal.module';

@Module({
  imports: [CategorieModule, AuthModule, PersonalModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
