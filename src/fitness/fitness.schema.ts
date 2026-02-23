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
  heightFeet: number;

  @Prop()
  heightInch: number;

  @Prop()
  weightKg: number;

  @Prop()
  bmi: number;

  // ⭐ ADD THESE
  @Prop()
  bmr?: number;

  @Prop()
  tdeeWithoutExercise?: number;

  @Prop()
  tdeeWithExercise?: number;

  @Prop({ enum: ActivityLevelEnum })
  activityLevel: ActivityLevelEnum;

  @Prop({ enum: YesNoEnum })
  exercise?: YesNoEnum;

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
  caloriesWithoutExercise?: number;

  @Prop()
  caloriesWithExercise?: number;
}

export const FitnessSchema = SchemaFactory.createForClass(Fitness);