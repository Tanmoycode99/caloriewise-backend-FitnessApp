import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  ValidateNested,
  IsEnum,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LifestyleDto {
  @ApiProperty({ example: 'no' })
  @IsString()
  smoking: string;

  @ApiProperty({ example: 'no' })
  @IsString()
  alcohol: string;
}

export class WeightProjectionDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  week: number;

  @ApiProperty({ example: 71.5 })
  @IsNumber()
  expectedWeight: number;
}

export class CreateExerciseDto {
  @ApiProperty({ example: 'Tanmoy Chakraborty' })
  @IsString()
  name: string;

  @ApiProperty({ enum: ['male', 'female', 'other'], example: 'male' })
  @IsEnum(['male', 'female', 'other'])
  gender: string;

  @ApiProperty({ example: '10-05-1999' })
  @IsString()
  dob: string;

  @ApiProperty({ example: '72' })
  @IsString()
  weight: string;

  @ApiProperty({ enum: ['vegetarian', 'Non vegetarian', 'vegan'], example: 'Non vegetarian' })
  @IsString()
  diet: string;

  @ApiProperty({ enum: ['lose', 'gain', 'maintain'], example: 'lose' })
  @IsEnum(['lose', 'gain', 'maintain'])
  weightGoalType: string;

  @ApiProperty({ example: '5' })
  @IsString()
  weightGoalAmount: string;

  @ApiProperty({
    enum: ['sedentary', 'light', 'moderate', 'active', 'very active'],
    example: 'moderate',
  })
  @IsString()
  activityLevel: string;

  @ApiPropertyOptional({ example: 'thyroid' })
  @IsOptional()
  @IsString()
  healthIssue?: string;

  @ApiProperty({ type: LifestyleDto })
  @IsObject()
  @ValidateNested()
  @Type(() => LifestyleDto)
  lifestyle: LifestyleDto;

  @ApiProperty({ example: 1891 })
  @IsNumber()
  caloriesRequired: number;

  @ApiProperty({ example: 23.5 })
  @IsNumber()
  bmi: number;

  @ApiProperty({ example: 1694 })
  @IsNumber()
  bmr: number;

  @ApiProperty({ example: 2625 })
  @IsNumber()
  tdee: number;

  @ApiProperty({ type: [WeightProjectionDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WeightProjectionDto)
  weightProjection: WeightProjectionDto[];
}