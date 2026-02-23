import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/* ---------- NESTED TYPES ---------- */

@Schema({ _id: false })
export class Lifestyle {
  @Prop()
  smoking: string;

  @Prop()
  alcohol: string;
}

@Schema({ _id: false })
export class Sleep {
  @Prop()
  sleepHours: string;

  @Prop()
  sleepQuality: string;
}

@Schema({ _id: false })
export class Supplement {
  @Prop()
  usage: string;
}

@Schema({ _id: false })
export class StressSurvey {
  @Prop()
  energy: string;

  @Prop()
  water: string;

  @Prop()
  stress: string;
}

@Schema({ _id: false })
export class ResultSurvey {
  @Prop()
  resultSpeed: string;

  @Prop()
  motivation: string;
}

/* ---------- MAIN USER SCHEMA ---------- */

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {

  /* BASIC INFO */

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  gender: string;

  @Prop({ required: true })
  dob: string;

  @Prop({ required: true })
  heightFeet: string;

  @Prop({ required: true })
  heightInch: string;

  @Prop({ required: true })
  weight: string;

  @Prop({ required: true })
  waist: string;

  /* DIET */

  @Prop({ required: true })
  diet: string;

  @Prop()
  dietType: string;

  @Prop()
  junkFood: string;

  @Prop()
  sugaryDrinks: string;

  /* GOALS */

  @Prop()
  selectedGoal: string;

  @Prop()
  weightGoalType: string;

  @Prop()
  weightGoalAmount: string;

  @Prop()
  activityLevel: string;

  @Prop()
  healthIssue: string;

  /* LIFESTYLE */

  @Prop({ type: Lifestyle })
  lifestyle: Lifestyle;

  @Prop()
  smokingYears: string;

  @Prop()
  drinkingYears: string;

  /* SLEEP */

  @Prop({ type: Sleep })
  sleep: Sleep;

  /* SUPPLEMENT */

  @Prop({ type: Supplement })
  supplement: Supplement;

  /* STRESS SURVEY */

  @Prop({ type: StressSurvey })
  stressSurvey: StressSurvey;

  /* RESULT SURVEY */

  @Prop({ type: ResultSurvey })
  resultSurvey: ResultSurvey;
}

export const UserSchema = SchemaFactory.createForClass(User);