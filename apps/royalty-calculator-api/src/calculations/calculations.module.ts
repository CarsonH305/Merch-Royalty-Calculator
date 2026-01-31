import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CalculationsController } from './calculations.controller';
import { CalculationsService } from './calculations.service';
import { ScenariosController } from './scenarios.controller';
import { ScenariosService } from './scenarios.service';
import { Scenario, ScenarioSchema } from './schemas/scenario.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Scenario.name, schema: ScenarioSchema },
    ]),
  ],
  controllers: [CalculationsController, ScenariosController],
  providers: [CalculationsService, ScenariosService],
})
export class CalculationsModule {}
