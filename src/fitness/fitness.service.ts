import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Fitness } from './fitness.schema';
import { CreateFitnessDto } from './create-fitness.dto';
import {
  ActivityLevelEnum,
  WeightGoalTypeEnum,
  YesNoEnum,
  ResultSpeedEnum,
} from '../users/enums/users.enums';

@Injectable()
export class FitnessService {
  constructor(
    private readonly usersService: UsersService,
    @InjectModel(Fitness.name) private fitnessModel: Model<Fitness>,
  ) {}

  async calculate(userId: string, dto: CreateFitnessDto) {
    const user = await this.usersService.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    const bmr = this.calculateBMR(dto);

    let withoutEx = this.calculateTDEE(bmr, dto.activityLevel, false);
    let withEx = this.calculateTDEE(
      bmr,
      dto.activityLevel,
      dto.exercise === YesNoEnum.Yes,
    );

    withoutEx = this.adjustForWeightGoal(
      withoutEx,
      dto.weightGoalType,
      dto.weightGoalAmount ?? 0,
      dto.resultSpeed,
    );

    withEx = this.adjustForWeightGoal(
      withEx,
      dto.weightGoalType,
      dto.weightGoalAmount ?? 0,
      dto.resultSpeed,
    );

    withoutEx = this.adjustForDiet(withoutEx, dto.dietType);
    withEx = this.adjustForDiet(withEx, dto.dietType);

    withoutEx = this.adjustForLifestyle(withoutEx, dto.smoking, dto.alcohol);
    withEx = this.adjustForLifestyle(withEx, dto.smoking, dto.alcohol);

    withoutEx = this.adjustForFoodHabits(
      withoutEx,
      dto.junkFood,
      dto.sugaryDrinks,
    );
    withEx = this.adjustForFoodHabits(
      withEx,
      dto.junkFood,
      dto.sugaryDrinks,
    );

    return this.fitnessModel.create({
      userId,
      ...dto,
      caloriesRequired: withoutEx,
      caloriesWithoutExercise: withoutEx,
      caloriesWithExercise: withEx,
    });
  }

  /* ---------- BMR ---------- */
  calculateBMR(dto: CreateFitnessDto): number {
    return 10 * dto.weightKg + 6.25 * dto.heightCm - 5 * dto.age + 5;
  }

  /* ---------- TDEE ---------- */
  calculateTDEE(
    bmr: number,
    activityLevel: ActivityLevelEnum,
    exercise: boolean,
  ): number {
    let multiplier = 1.2;

    if (activityLevel === ActivityLevelEnum.Light) multiplier = 1.375;
    if (activityLevel === ActivityLevelEnum.Moderate) multiplier = 1.55;
    if (activityLevel === ActivityLevelEnum.Active) multiplier = 1.725;

    let calories = bmr * multiplier;
    if (exercise) calories += 300;

    return Math.round(calories);
  }

  /* ---------- WEIGHT GOAL ---------- */
  adjustForWeightGoal(
    calories: number,
    goalType: WeightGoalTypeEnum,
    goalAmount: number,
    resultSpeed?: ResultSpeedEnum,
  ): number {
    if (!goalAmount || goalType === WeightGoalTypeEnum.Maintain) return calories;

    const amount = Math.min(Math.max(goalAmount, 0.25), 1);
    let dailyAdjustment = (7700 * amount) / 7;

    if (resultSpeed === ResultSpeedEnum.Slow) dailyAdjustment *= 0.8;
    if (resultSpeed === ResultSpeedEnum.Aggressive) dailyAdjustment *= 1.2;

    dailyAdjustment = Math.min(dailyAdjustment, 1100);

    if (goalType === WeightGoalTypeEnum.Lose)
      return Math.round(calories - dailyAdjustment);

    if (goalType === WeightGoalTypeEnum.Gain)
      return Math.round(calories + dailyAdjustment);

    return calories;
  }

  /* ---------- DIET ---------- */
  adjustForDiet(calories: number, dietType?: string): number {
    if (!dietType) return calories;

    switch (dietType.toLowerCase()) {
      case 'veg':
        return Math.round(calories * 0.98);
      case 'vegan':
        return Math.round(calories * 0.97);
      case 'eggetarian':
        return Math.round(calories * 0.99);
      default:
        return calories;
    }
  }

  /* ---------- LIFESTYLE ---------- */
  adjustForLifestyle(
    calories: number,
    smoking?: YesNoEnum,
    alcohol?: YesNoEnum,
  ): number {
    let adjusted = calories;
    if (smoking === YesNoEnum.Yes) adjusted *= 1.03;
    if (alcohol === YesNoEnum.Yes) adjusted *= 1.05;
    return Math.round(adjusted);
  }

  /* ---------- FOOD HABITS ---------- */
  adjustForFoodHabits(
    calories: number,
    junkFood?: YesNoEnum,
    sugaryDrinks?: YesNoEnum,
  ): number {
    let adjusted = calories;
    if (junkFood === YesNoEnum.Yes) adjusted *= 1.05;
    if (sugaryDrinks === YesNoEnum.Yes) adjusted *= 1.04;
    return Math.round(adjusted);
  }
}
