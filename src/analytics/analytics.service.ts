import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CreateAnalyticsDto,
  StaminaLevel,
  RiskLevel,
  YesOccasionallyNo,
} from './create-analytics.dto';
import { Analytics, AnalyticsDocument } from './analytics.schema';

type WeightProjection = {
  week: number;
  expectedWeight: number;
};

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(Analytics.name)
    private analyticsModel: Model<AnalyticsDocument>,
  ) {}

  async generateAnalytics(dto: CreateAnalyticsDto) {
    const {
      userId,
      name,
      age,
      gender,
      weight,
      heightCm,
      activityLevel,
      smoking,
      alcohol,
      weightGoalType,
      weightGoalAmount,
    } = dto;

    /* ---------- BMI ---------- */
    const bmi = weight / Math.pow(heightCm / 100, 2);

    /* ---------- BMR ---------- */
    const bmr =
      10 * weight +
      6.25 * heightCm -
      5 * age +
      (gender === 'Male' ? 5 : -161);

    /* ---------- TDEE ---------- */
    let multiplier = 1.2;
    if (activityLevel === 'light') multiplier = 1.375;
    if (activityLevel === 'moderate') multiplier = 1.55;
    if (activityLevel === 'active') multiplier = 1.725;

    const tdee = Math.round(bmr * multiplier);

    /* ---------- Calories ---------- */
    const recommendedCalories =
      weightGoalType === 'lose'
        ? tdee - 500
        : weightGoalType === 'gain'
        ? tdee + 500
        : tdee;

    /* ---------- Weekly Change ---------- */
    const weeklyChange =
      weightGoalType === 'lose'
        ? -0.5
        : weightGoalType === 'gain'
        ? 0.5
        : 0;

    const weeksToGoal =
      weeklyChange !== 0
        ? Math.ceil(Math.abs(weightGoalAmount / weeklyChange))
        : 0;

    /* ---------- Stamina Logic ---------- */
    let staminaLevel: StaminaLevel = StaminaLevel.Medium;

    if (smoking === 'no' && alcohol === 'no') {
      staminaLevel = StaminaLevel.High;
    } else if (smoking === 'yes' || alcohol === 'yes') {
      staminaLevel = StaminaLevel.Low;
    }

    /* ---------- Risk Level ---------- */
    let riskLevel: RiskLevel = RiskLevel.Low;

    if (bmi >= 30 || smoking === 'yes' || alcohol === 'yes') {
      riskLevel = RiskLevel.High;
    } else if (bmi >= 25) {
      riskLevel = RiskLevel.Medium;
    }

    /* ---------- Heart Health ---------- */
    let restingHeartRate = 72;
    let heartRateVariability = 50;

    if (staminaLevel === StaminaLevel.High) {
      restingHeartRate -= 4;
      heartRateVariability += 10;
    } else if (staminaLevel === StaminaLevel.Low) {
      restingHeartRate += 6;
      heartRateVariability -= 5;
    }

    const bloodPressureEstimate =
      riskLevel === RiskLevel.High
        ? '140/90'
        : riskLevel === RiskLevel.Medium
        ? '130/85'
        : '120/80';

    /* ---------- Weight Projection ---------- */
    const weightProjection: WeightProjection[] = [];
    let currentWeight = weight;

    for (let i = 1; i <= weeksToGoal; i++) {
      currentWeight += weeklyChange;
      weightProjection.push({
        week: i,
        expectedWeight: Number(currentWeight.toFixed(1)),
      });
    }

    /* ---------- Final Object ---------- */
    const analyticsData = {
      userId,
      name,
      age,
      gender,
      bodyMetrics: {
        weight,
        heightCm,
        bmi: Number(bmi.toFixed(1)),
        bmr: Math.round(bmr),
        tdee,
        recommendedCalories,
      },
      goal: {
        weightGoalType,
        weightGoalAmount,
        weeksToGoal,
        weeklyChange,
      },
      heartHealth: {
        restingHeartRate,
        heartRateVariability,
        staminaLevel,
        bloodPressureEstimate,
        riskLevel,
      },
      weightProjection,
    };

    const saved = await this.analyticsModel.create(analyticsData);

    return saved;
  }
}
