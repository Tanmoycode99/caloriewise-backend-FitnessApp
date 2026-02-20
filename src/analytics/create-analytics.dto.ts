import {
  IsString,
  IsNumber,
  IsEnum,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum YesOccasionallyNo {
  Yes = 'yes',
  Occasionally = 'occasionally',
  No = 'no',
}

export enum WeightGoalType {
  Lose = 'lose',
  Gain = 'gain',
  Maintain = 'maintain',
}

export enum StaminaLevel {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
}

export enum RiskLevel {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
}

export class CreateAnalyticsDto {
  @IsString()
  userId: string;

  @IsString()
  name: string;

  @IsNumber()
  @Type(() => Number)
  age: number;

  @IsString()
  gender: string;

  @IsNumber()
  @Min(30)
  @Max(300)
  @Type(() => Number)
  weight: number;

  @IsNumber()
  @Min(100)
  @Max(250)
  @Type(() => Number)
  heightCm: number;

  @IsString()
  activityLevel: string;

  @IsEnum(YesOccasionallyNo)
  smoking: YesOccasionallyNo;

  @IsEnum(YesOccasionallyNo)
  alcohol: YesOccasionallyNo;

  @IsEnum(WeightGoalType)
  weightGoalType: WeightGoalType;

  @IsNumber()
  @Type(() => Number)
  weightGoalAmount: number;
}
