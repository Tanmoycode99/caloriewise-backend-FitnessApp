import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import {
  ActivityLevelEnum,
  WeightGoalTypeEnum,
  YesNoEnum,
  ResultSpeedEnum,
} from '../users/enums/users.enums';

@Schema({ timestamps: true })
export class Fitness extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @Prop()
  age: number;

  @Prop()
  weightKg: number;

  @Prop()
  heightCm: number;

  @Prop({ enum: ActivityLevelEnum })
  activityLevel: ActivityLevelEnum;

  @Prop({ enum: YesNoEnum })
  exercise: YesNoEnum;

  @Prop({ enum: WeightGoalTypeEnum })
  weightGoalType: WeightGoalTypeEnum;

  @Prop()
  weightGoalAmount?: number;

  @Prop()
  dietType?: string;

  @Prop({ enum: YesNoEnum })
  smoking?: YesNoEnum;

  @Prop({ enum: YesNoEnum })
  alcohol?: YesNoEnum;

  @Prop({ enum: YesNoEnum })
  junkFood?: YesNoEnum;

  @Prop({ enum: YesNoEnum })
  sugaryDrinks?: YesNoEnum;

  @Prop({ enum: ResultSpeedEnum })
  resultSpeed?: ResultSpeedEnum;

  @Prop()
  caloriesRequired?: number;

  @Prop()
  caloriesWithExercise?: number;

  @Prop()
  caloriesWithoutExercise?: number;
}

export const FitnessSchema = SchemaFactory.createForClass(Fitness);
