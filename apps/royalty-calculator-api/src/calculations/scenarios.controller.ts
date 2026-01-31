import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ScenariosService } from './scenarios.service';

@ApiTags('scenarios')
@Controller('scenarios')
export class ScenariosController {
  constructor(private readonly scenariosService: ScenariosService) {}

  @Post()
  @ApiOperation({ summary: 'Save scenario' })
  create(
    @Body() body: { name: string; input: Record<string, unknown>; result: Record<string, unknown>; mode: string }
  ) {
    return this.scenariosService.create(body);
  }

  @Get()
  @ApiOperation({ summary: 'List scenarios' })
  findAll() {
    return this.scenariosService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Load scenario by ID' })
  findOne(@Param('id') id: string) {
    return this.scenariosService.findOne(id);
  }
}
