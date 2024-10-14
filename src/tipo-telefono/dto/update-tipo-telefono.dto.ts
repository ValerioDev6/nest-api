import { PartialType } from '@nestjs/mapped-types';
import { CreateTipoTelefonoDto } from './create-tipo-telefono.dto';

export class UpdateTipoTelefonoDto extends PartialType(CreateTipoTelefonoDto) {}
