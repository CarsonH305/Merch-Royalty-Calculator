import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CalculationsModule } from '../calculations/calculations.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/royalty-calculator'),
    CalculationsModule,
  ],
})
export class AppModule {}
