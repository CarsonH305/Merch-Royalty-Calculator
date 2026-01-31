import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CalculationsService } from './calculations.service';

@ApiTags('calculations')
@Controller('calculations')
export class CalculationsController {
  constructor(private readonly calculationsService: CalculationsService) {}

  @Post('run')
  @ApiOperation({ summary: 'Run calculation (stateless)' })
  run(@Body() input: Record<string, unknown>) {
    return this.calculationsService.run(input);
  }
}
