import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EmpresaDto, PersonaDto, PersonaService } from './persona.service';
import { CreatePersonaDto } from './dto/create-persona.dto';
import { UpdatePersonaDto } from './dto/update-persona.dto';

@Controller('persona')
export class PersonaController {
  constructor(private readonly personaService: PersonaService) {}

  @Post()
  create(@Body() createPersonaDto: CreatePersonaDto) {
    return this.personaService.create(createPersonaDto);
  }

  @Get()
  findAll() {
    return this.personaService.findAll();
  }
  @Get('personal')
  getPersonasPersonalCombo() {
    return this.personaService.getPersonasByTipo(PersonaService.TIPO_PERSONA.PERSONAL);
  }

  @Get('cliente')
  getPersonasClienteCombo() {
    return this.personaService.getPersonasByTipo(PersonaService.TIPO_PERSONA.CLIENTE);
  }

  @Get('proveedor')
  getPersonasProveedoresCombo() {
    return this.personaService.getPersonasByTipo(PersonaService.TIPO_PERSONA.PROVEEDOR);
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.personaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePersonaDto: UpdatePersonaDto) {
    return this.personaService.update(+id, updatePersonaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.personaService.remove(+id);
  }

  @Get('consulta/:dni')
  async consultarPersona(@Param('dni') dni: number): Promise<PersonaDto> {
    return this.personaService.consultarDNI(+dni);
  }

  @Get('consulta-ruc/:ruc')
  async consultarEmpresa(@Param('ruc') ruc: string): Promise<EmpresaDto> {
    return this.personaService.consultarRUC(ruc);
  }
}
