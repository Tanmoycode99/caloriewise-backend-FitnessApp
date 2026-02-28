import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExerciseController } from './exercise.controller';
import { ExerciseService } from './exercise.service';
import { ExercisePlan, ExercisePlanSchema } from './exercise.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ExercisePlan.name, schema: ExercisePlanSchema },
    ]),
  ],
  controllers: [ExerciseController],
  providers: [ExerciseService],
  exports: [ExerciseService],
})
export class ExerciseModule {}
