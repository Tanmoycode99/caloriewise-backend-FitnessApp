import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  Max,
  Matches,
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

   @IsString()
  userId: string;

  @IsString()
  @Matches(/^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/, {
    message: 'dob must be in DD-MM-YYYY format',
  })
  dob: string;

  @IsNumber()
  @Min(30)
  @Max(300)
  weightKg: number;

  @IsNumber()
  @Min(3)
  @Max(8)
  heightFeet: number;

  @IsNumber()
  @Min(0)
  @Max(11)
  heightInch: number;

  /* ---------- ACTIVITY ---------- */

  @IsEnum(ActivityLevelEnum)
  activityLevel: ActivityLevelEnum;

  @IsOptional()   // ✅ now optional
  @IsEnum(YesNoEnum)
  exercise?: YesNoEnum;

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
  dietType?: string;

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