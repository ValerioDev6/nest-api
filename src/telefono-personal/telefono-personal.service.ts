import { Injectable } from '@nestjs/common';
import { CreateTelefonoPersonalDto } from './dto/create-telefono-personal.dto';
import { UpdateTelefonoPersonalDto } from './dto/update-telefono-personal.dto';

@Injectable()
export class TelefonoPersonalService {
  create(createTelefonoPersonalDto: CreateTelefonoPersonalDto) {
    return 'This action adds a new telefonoPersonal';
  }

  findAll() {
    return `This action returns all telefonoPersonal`;
  }

  findOne(id: number) {
    return `This action returns a #${id} telefonoPersonal`;
  }

  update(id: number, updateTelefonoPersonalDto: UpdateTelefonoPersonalDto) {
    return `This action updates a #${id} telefonoPersonal`;
  }

  remove(id: number) {
    return `This action removes a #${id} telefonoPersonal`;
  }
}
