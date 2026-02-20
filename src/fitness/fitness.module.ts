import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FitnessService } from './fitness.service';
import { FitnessController } from './fitness.controller';
import { Fitness, FitnessSchema } from './fitness.schema';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([{ name: Fitness.name, schema: FitnessSchema }]),
  ],
  providers: [FitnessService],
  controllers: [FitnessController],
})
export class FitnessModule {}
