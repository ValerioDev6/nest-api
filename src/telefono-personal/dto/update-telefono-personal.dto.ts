import { PartialType } from '@nestjs/mapped-types';
import { CreateTelefonoPersonalDto } from './create-telefono-personal.dto';

export class UpdateTelefonoPersonalDto extends PartialType(CreateTelefonoPersonalDto) {}
