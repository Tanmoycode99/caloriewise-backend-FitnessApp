import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {
  GenderEnum,
  WeightGoalTypeEnum,
  ActivityLevelEnum,
  YesNoEnum,
} from '../users/enums/users.enums';

@Schema({ timestamps: true })
export class User extends Document {
  /* ---------- BASIC INFO ---------- */

  @Prop({ required: true })
  name: string;

  @Prop({ enum: GenderEnum, required: true })
  gender: GenderEnum;

  @Prop({ required: true })
  age: number;

  @Prop()
  weight: number;

  @Prop({ required: true })
  heightCm: number;

  @Prop()
  waist: number;

  /* ---------- GOAL ---------- */

  @Prop()
  selectedGoal: string;

  /* ---------- WEIGHT GOAL ---------- */

  @Prop({ enum: WeightGoalTypeEnum })
  weightGoalType: WeightGoalTypeEnum;

  @Prop()
  weightGoalAmount: number;

  /* ---------- ACTIVITY & HEALTH ---------- */

  @Prop({ enum: ActivityLevelEnum })
  activityLevel: ActivityLevelEnum;

  @Prop([String])
  healthIssues: string[];

  /* ---------- LIFESTYLE ---------- */

  @Prop({ enum: YesNoEnum })
  smoking: YesNoEnum;

  @Prop({ enum: YesNoEnum })
  alcohol: YesNoEnum;

  /* ---------- SLEEP ---------- */

  @Prop()
  sleepHours: string;

  @Prop({ enum: ['poor', 'average', 'good'] })
  sleepQuality: string;

  /* ---------- DIET ---------- */

  @Prop()
  dietType: string;

  @Prop({ enum: YesNoEnum })
  junkFood: YesNoEnum;

  @Prop({ enum: YesNoEnum })
  sugaryDrinks: YesNoEnum;

  /* ---------- STRESS ---------- */

  @Prop({ enum: ['low', 'medium', 'high'] })
  stressLevel: string;

  /* ---------- RESULT ---------- */

  @Prop({ enum: ['fast', 'balanced', 'slow'] })
  resultSpeed: string;

  @Prop({ enum: ['low', 'medium', 'high'] })
  motivation: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
