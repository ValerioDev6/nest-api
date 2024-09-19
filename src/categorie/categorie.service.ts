import { Injectable } from '@nestjs/common';
import { CreateCategorieDto } from './dto/create-categorie.dto';
import { UpdateCategorieDto } from './dto/update-categorie.dto';

@Injectable()
export class CategorieService {
  create(createCategorieDto: CreateCategorieDto) {
    return 'This action adds a new categorie';
  }

  findAll() {
    return `This action returns all categorie`;
  }

  findOne(id: number) {
    return `This action returns a #${id} categorie`;
  }

  update(id: number, updateCategorieDto: UpdateCategorieDto) {
    return `This action updates a #${id} categorie`;
  }

  remove(id: number) {
    return `This action removes a #${id} categorie`;
  }
}
