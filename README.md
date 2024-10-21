# Configuración de Prisma con NestJS y MySQL

Este README describe los pasos para configurar Prisma con NestJS y MySQL en tu proyecto.

## Pasos de Instalación

1. Instalar Prisma como dependencia de desarrollo:

   ```
   npm install prisma --save-dev
   ```

2. Inicializar Prisma con MySQL como proveedor de base de datos:

   ```
   npx prisma init --datasource-provider mysql
   ```

3. Instalar el cliente de Prisma:

   ```
   npm install @prisma/client
   ```

4. Generar el esquema de Prisma a partir de la base de datos existente:

   ```
   npx prisma db pull
   ```

5. Generar el cliente de Prisma basado en el esquema:

   ```
   npx prisma generate
   ```

   6 . npm i --save @nestjs/config

## Configuración del Servicio Prisma

Crear un archivo `prisma.service.ts` en tu proyecto NestJS con el siguiente contenido:

```typescript
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}
```

## Configuración de main.ts

## plan de mejora descirbir , pasos, opiniones, sobre el coso cuaderno d ienform , requisiots informales que dayli que hicimos

## npm install @jsreport/jsreport-core @jsreport/jsreport-html-to-xlsx
