import { Injectable } from '@nestjs/common';
import { calculate } from '../calculation/calculator';
import type { CalculatorInput } from '../calculation/models';

@Injectable()
export class CalculationsService {
  run(input: Record<string, unknown>) {
    const typedInput = input as unknown as CalculatorInput;
    return calculate(typedInput);
  }
}
