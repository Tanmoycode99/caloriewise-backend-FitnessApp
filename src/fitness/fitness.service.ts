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

    const age = this.getAgeFromDOB(dto.dob);

    const heightCm =
      ((dto.heightFeet * 12) + dto.heightInch) * 2.54;

    const bmi = dto.weightKg / ((heightCm / 100) ** 2);

    const bmr = this.calculateBMR(dto.weightKg, heightCm, age, user.gender);

    const exerciseFlag = dto.exercise === YesNoEnum.Yes;

    let withoutEx = this.calculateTDEE(bmr, dto.activityLevel, false);
    let withEx = this.calculateTDEE(bmr, dto.activityLevel, exerciseFlag);

    withoutEx = this.adjustForWeightGoal(
      withoutEx,
      dto.weightGoalType,
      dto.weightGoalAmount,
      dto.resultSpeed,
    );

    withEx = this.adjustForWeightGoal(
      withEx,
      dto.weightGoalType,
      dto.weightGoalAmount,
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
  age,
  heightFeet: dto.heightFeet,
  heightInch: dto.heightInch,
  weightKg: dto.weightKg,

  bmi: Number(bmi.toFixed(1)),

  // ⭐ ADD THESE
  bmr: Math.round(bmr),
  tdeeWithoutExercise: withoutEx,
  tdeeWithExercise: withEx,

  activityLevel: dto.activityLevel,
  exercise: dto.exercise,
  weightGoalType: dto.weightGoalType,
  weightGoalAmount: dto.weightGoalAmount,
  dietType: dto.dietType,
  smoking: dto.smoking,
  alcohol: dto.alcohol,
  junkFood: dto.junkFood,
  sugaryDrinks: dto.sugaryDrinks,
  resultSpeed: dto.resultSpeed,

  caloriesRequired: withoutEx,
  caloriesWithoutExercise: withoutEx,
  caloriesWithExercise: withEx,
});
  }

  /* ---------- BMR ---------- */
  private calculateBMR(
    weightKg: number,
    heightCm: number,
    age: number,
    gender?: string,
  ): number {
    if (gender?.toLowerCase() === 'female') {
      return 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
    }
    return 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  }

  /* ---------- DOB → AGE ---------- */
  private getAgeFromDOB(dob: string): number {
    const [day, month, year] = dob.split('-').map(Number);
    const birthDate = new Date(year, month - 1, day);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  }

  /* ---------- TDEE ---------- */
  private calculateTDEE(
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
  private adjustForWeightGoal(
    calories: number,
    goalType: WeightGoalTypeEnum,
    goalAmount?: number,
    resultSpeed?: ResultSpeedEnum,
  ): number {
    if (!goalAmount || goalType === WeightGoalTypeEnum.Maintain)
      return calories;

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
  private adjustForDiet(calories: number, dietType?: string): number {
    if (!dietType) return calories;

    const diet = dietType.toLowerCase();

    if (diet.includes('veg')) return Math.round(calories * 0.98);
    if (diet.includes('vegan')) return Math.round(calories * 0.97);
    if (diet.includes('egg')) return Math.round(calories * 0.99);

    return calories;
  }

  /* ---------- LIFESTYLE ---------- */
  private adjustForLifestyle(
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
  private adjustForFoodHabits(
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