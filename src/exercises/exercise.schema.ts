import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ExercisePlanDocument = ExercisePlan & Document;

@Schema({ timestamps: true })
export class ExerciseItem {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  category: string; // cardio, yoga, strength, hiit, flexibility

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  duration: number; // minutes

  @Prop({ required: true })
  sets: number;

  @Prop({ required: true })
  reps: string;

  @Prop({ required: true })
  caloriesBurned: number;

  @Prop({ required: true })
  intensity: string; // low, medium, high

  @Prop({ required: true })
  muscleGroups: string[];

  @Prop({ required: true })
  equipmentNeeded: string[];

  @Prop()
  notes: string;

  @Prop({ required: true })
  suitableFor: string[]; // goals: lose, gain, maintain

  @Prop()
  contraindications: string[]; // health issues to be careful with

  @Prop({ required: true })
  dayOfWeek: string;

  @Prop({ required: true })
  timeOfDay: string; // morning, afternoon, evening

  @Prop({ required: true })
  videoUrl: string;

  @Prop({ required: true })
  imageUrl: string;

  @Prop({ required: true })
  metsValue: number; // metabolic equivalent
}

@Schema({ timestamps: true })
export class ExercisePlan {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  gender: string;

  @Prop({ required: true })
  dob: string;

  @Prop({ required: true })
  weight: string;

  @Prop({ required: true })
  diet: string;

  @Prop({ required: true })
  weightGoalType: string;

  @Prop({ required: true })
  weightGoalAmount: string;

  @Prop({ required: true })
  activityLevel: string;

  @Prop()
  healthIssue: string;

  @Prop({ type: Object })
  lifestyle: {
    smoking: string;
    alcohol: string;
  };

  @Prop()
  caloriesRequired: number;

  @Prop()
  bmi: number;

  @Prop()
  bmr: number;

  @Prop()
  tdee: number;

  @Prop({ type: [{ week: Number, expectedWeight: Number }] })
  weightProjection: Array<{ week: number; expectedWeight: number }>;

  @Prop({ type: [Object], required: true })
  exercises: ExerciseItem[];

  @Prop({ required: true })
  totalWeeklyCaloriesBurned: number;

  @Prop({ required: true })
  planSummary: string;

  @Prop({ required: true })
  weeklySchedule: string;

  @Prop({ type: [String] })
  nutritionTips: string[];

  @Prop({ type: [String] })
  generalTips: string[];
}

export const ExercisePlanSchema = SchemaFactory.createForClass(ExercisePlan);
