import { Module } from '@nestjs/common';
import { FitnessService } from './fitness.service';
import { FitnessController } from './fitness.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Fitness, FitnessSchema } from './fitness.schema';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Fitness.name, schema: FitnessSchema }]),
    UsersModule,
  ],
  controllers: [FitnessController],
  providers: [FitnessService],
})
export class FitnessModule {}