import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  ActivityLevelEnum,
  WeightGoalTypeEnum,
  YesNoEnum,
  ResultSpeedEnum,
} from '../users/enums/users.enums';

export class CreateFitnessDto {
  /* ---------- BODY ---------- */

  @IsNumber()
  @Min(10)
  @Max(120)
  age: number;

  @IsNumber()
  @Min(30)
  @Max(300)
  weightKg: number;

  @IsNumber()
  @Min(100)
  @Max(250)
  heightCm: number;

  /* ---------- ACTIVITY ---------- */

  @IsEnum(ActivityLevelEnum)
  activityLevel: ActivityLevelEnum;

  @IsEnum(YesNoEnum)
  exercise: YesNoEnum;

  /* ---------- GOAL ---------- */

  @IsEnum(WeightGoalTypeEnum)
  weightGoalType: WeightGoalTypeEnum;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0.25)
  @Max(1)
  weightGoalAmount?: number;

  /* ---------- DIET ---------- */

  @IsOptional()
  @IsString()
  dietType?: string; // veg | vegan | eggetarian | non-vegetarian

  /* ---------- LIFESTYLE ---------- */

  @IsOptional()
  @IsEnum(YesNoEnum)
  smoking?: YesNoEnum;

  @IsOptional()
  @IsEnum(YesNoEnum)
  alcohol?: YesNoEnum;

  @IsOptional()
  @IsEnum(YesNoEnum)
  junkFood?: YesNoEnum;

  @IsOptional()
  @IsEnum(YesNoEnum)
  sugaryDrinks?: YesNoEnum;

  /* ---------- PREFERENCE ---------- */

  @IsOptional()
  @IsEnum(ResultSpeedEnum)
  resultSpeed?: ResultSpeedEnum;
}
