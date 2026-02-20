import {
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  IsArray,
} from 'class-validator';
import {
  GenderEnum,
  WeightGoalTypeEnum,
  ActivityLevelEnum,
  YesNoEnum,
} from '../enums/users.enums';

export class CreateUserDto {
  /* ---------- BASIC INFO ---------- */

  @IsString()
  name: string;

  @IsEnum(GenderEnum)
  gender: GenderEnum;

  @IsNumber()
  age: number;

  @IsOptional()
  @IsNumber()
  weight?: number;

  @IsNumber()
  heightCm: number;

  @IsOptional()
  @IsNumber()
  waist?: number;

  /* ---------- GOAL ---------- */

  @IsOptional()
  @IsString()
  selectedGoal?: string;

  /* ---------- WEIGHT GOAL ---------- */

  @IsOptional()
  @IsEnum(WeightGoalTypeEnum)
  weightGoalType?: WeightGoalTypeEnum;

  @IsOptional()
  @IsNumber()
  weightGoalAmount?: number;

  /* ---------- ACTIVITY & HEALTH ---------- */

  @IsOptional()
  @IsEnum(ActivityLevelEnum)
  activityLevel?: ActivityLevelEnum;

  @IsOptional()
  @IsArray()
  healthIssues?: string[];

  /* ---------- LIFESTYLE ---------- */

  @IsOptional()
  @IsEnum(YesNoEnum)
  smoking?: YesNoEnum;

  @IsOptional()
  @IsEnum(YesNoEnum)
  alcohol?: YesNoEnum;

  /* ---------- SLEEP ---------- */

  @IsOptional()
  @IsString()
  sleepHours?: string;

  @IsOptional()
  @IsEnum(['poor', 'average', 'good'])
  sleepQuality?: string;

  /* ---------- DIET ---------- */

  @IsOptional()
  @IsString()
  dietType?: string;

  @IsOptional()
  @IsEnum(YesNoEnum)
  junkFood?: YesNoEnum;

  @IsOptional()
  @IsEnum(YesNoEnum)
  sugaryDrinks?: YesNoEnum;

  /* ---------- STRESS ---------- */

  @IsOptional()
  @IsEnum(['low', 'medium', 'high'])
  stressLevel?: string;

  /* ---------- RESULT ---------- */

  @IsOptional()
  @IsEnum(['fast', 'balanced', 'slow'])
  resultSpeed?: string;

  @IsOptional()
  @IsEnum(['low', 'medium', 'high'])
  motivation?: string;
}
