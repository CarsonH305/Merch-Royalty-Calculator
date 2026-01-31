import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Scenario extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ type: Object, required: true })
  input: Record<string, unknown>;

  @Prop({ type: Object, required: true })
  result: Record<string, unknown>;

  @Prop({ default: 'merch-only' })
  mode: string;

  @Prop()
  userId?: string;
}

export const ScenarioSchema = SchemaFactory.createForClass(Scenario);
