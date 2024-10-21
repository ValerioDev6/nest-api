import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CategorieModule } from './categorie/categorie.module';
import { ClienteModule } from './cliente/cliente.module';
import { CommonModule } from './common/common.module';
import { DireccionModule } from './direccion/direccion.module';
import { MarcasModule } from './marcas/marcas.module';
import { PaisModule } from './pais/pais.module';
import { PersonaModule } from './persona/persona.module';
import { PersonalModule } from './personal/personal.module';
import { PrismaModule } from './prisma/prima.module';
import { PrismaService } from './prisma/prisma.service';
import { ProductsModule } from './products/products.module';
import { ProveedoresModule } from './proveedores/proveedores.module';
import { RolesModule } from './roles/roles.module';
import { SexoModule } from './sexo/sexo.module';
import { SurcursalModule } from './surcursal/surcursal.module';
import { TelefonoPersonalModule } from './telefono-personal/telefono-personal.module';
import { TipoDocumentoModule } from './tipo-documento/tipo-documento.module';
import { TipoPersonaModule } from './tipo-persona/tipo-persona.module';
import { TipoTelefonoModule } from './tipo-telefono/tipo-telefono.module';
import { TipoViaModule } from './tipo-via/tipo-via.module';
import { TipoZonaModule } from './tipo-zona/tipo-zona.module';
import { BasicReportsModule } from './basic-reports/basic-reports.module';
import { PrinterModule } from './printer/printer.module';
import { BasicReportsExcelModule } from './basic-reports-excel/basic-reports-excel.module';
import { TipoPropietarioModule } from './tipo-propietario/tipo-propietario.module';

@Module({
  imports: [
    CategorieModule,
    AuthModule,
    PersonalModule,
    CommonModule,
    PrismaModule,
    PersonaModule,
    RolesModule,
    ProductsModule,
    TipoPersonaModule,
    SexoModule,
    TipoDocumentoModule,
    PaisModule,
    DireccionModule,
    TelefonoPersonalModule,
    ProveedoresModule,
    ClienteModule,
    MarcasModule,
    SurcursalModule,
    TipoZonaModule,
    TipoViaModule,
    TipoTelefonoModule,
    BasicReportsModule,
    PrinterModule,
    BasicReportsExcelModule,
    TipoPropietarioModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
