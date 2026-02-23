import {
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  IsObject,
  ValidateNested,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

export class LifestyleDto {
  @IsString()
  smoking: string;

  @IsString()
  alcohol: string;
}

export class SleepDto {
  @IsString()
  sleepHours: string;

  @IsString()
  sleepQuality: string;
}

export class SupplementDto {
  @IsString()
  usage: string;
}

export class StressSurveyDto {
  @IsString()
  energy: string;

  @IsString()
  water: string;

  @IsString()
  stress: string;
}

export class ResultSurveyDto {
  @IsString()
  resultSpeed: string;

  @IsString()
  motivation: string;
}

export class CreateUserDto {
  /* BASIC INFO */

  @IsString()
  name: string;

  @IsString()
  gender: string;

  @IsString()
  dob: string;

  @IsString()
  heightFeet: string;

  @IsString()
  heightInch: string;

  @IsString()
  weight: string;

  @IsString()
  waist: string;

  /* DIET */

  @IsString()
  diet: string; // "Non vegetarian" (converted from characters)

  @IsString()
  dietType: string;

  @IsString()
  junkFood: string;

  @IsString()
  sugaryDrinks: string;

  /* GOALS */

  @IsString()
  selectedGoal: string;

  @IsString()
  weightGoalType: string;

  @IsString()
  weightGoalAmount: string;

  @IsString()
  activityLevel: string;

  @IsString()
  healthIssue: string;

  /* LIFESTYLE */

  @ValidateNested()
  @Type(() => LifestyleDto)
  lifestyle: LifestyleDto;

  @IsString()
  smokingYears: string;

  @IsString()
  drinkingYears: string;

  /* SLEEP */

  @ValidateNested()
  @Type(() => SleepDto)
  sleep: SleepDto;

  /* SUPPLEMENTS */

  @ValidateNested()
  @Type(() => SupplementDto)
  supplement: SupplementDto;

  /* STRESS SURVEY */

  @ValidateNested()
  @Type(() => StressSurveyDto)
  stressSurvey: StressSurveyDto;

  /* RESULT SURVEY */

  @ValidateNested()
  @Type(() => ResultSurveyDto)
  resultSurvey: ResultSurveyDto;
}