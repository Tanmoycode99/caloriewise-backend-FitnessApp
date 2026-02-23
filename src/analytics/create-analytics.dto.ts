import {
  IsString,
  IsNumber,
  IsEnum,
  Min,
  Max,
  Matches,
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

export class CreateAnalyticsDto {
  @IsString()
  userId: string;

  @IsString()
  name: string;

  // ✅ DOB (dd-mm-yyyy)
  @IsString()
  @Matches(/^\d{2}-\d{2}-\d{4}$/)
  dob: string;

  @IsString()
  gender: string;

  @IsNumber()
  @Type(() => Number)
  weight: number;

  // ✅ HEIGHT IN FEET & INCH
  @IsNumber()
  @Min(3)
  @Max(8)
  @Type(() => Number)
  heightFeet: number;

  @IsNumber()
  @Min(0)
  @Max(11)
  @Type(() => Number)
  heightInch: number;

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