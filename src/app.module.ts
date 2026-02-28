import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { FitnessModule } from './fitness/fitness.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { ExerciseModule } from './exercises/exercise.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(
      process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/caloriewise',
    ),
    UsersModule,
    FitnessModule,
    AnalyticsModule,
    ExerciseModule,
  ],
})
export class AppModule {}
