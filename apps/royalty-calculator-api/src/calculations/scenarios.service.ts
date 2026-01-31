import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Scenario } from './schemas/scenario.schema';

@Injectable()
export class ScenariosService {
  constructor(
    @InjectModel(Scenario.name) private scenarioModel: Model<Scenario>
  ) {}

  async create(body: {
    name: string;
    input: Record<string, unknown>;
    result: Record<string, unknown>;
    mode: string;
  }) {
    const scenario = new this.scenarioModel(body);
    return scenario.save();
  }

  async findAll() {
    return this.scenarioModel.find().sort({ createdAt: -1 }).lean();
  }

  async findOne(id: string) {
    const scenario = await this.scenarioModel.findById(id).lean();
    if (!scenario) {
      throw new NotFoundException(`Scenario ${id} not found`);
    }
    return scenario;
  }
}
