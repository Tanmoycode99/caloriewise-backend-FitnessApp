import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { ExerciseService } from './exercise.service';
import { CreateExerciseDto } from './exercise.dto';

@ApiTags('Exercise')
@Controller('exercise')
export class ExerciseController {
  constructor(private readonly exerciseService: ExerciseService) {}

  /**
   * POST /exercise/generate
   * Generate a personalized 50-exercise plan (5 niches × 10 exercises)
   * dynamically adapted to the user's health profile
   */
  @Post('generate')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Generate AI-personalised 50-exercise plan',
    description:
      'Accepts full health profile and returns 50 exercises across ' +
      'Cardio, Yoga, Strength, HIIT and Flexibility. ' +
      'Exercise selection, duration, intensity and notes adapt to BMI, age, ' +
      'health issues (e.g. thyroid), lifestyle habits, and weight goal.',
  })
  @ApiBody({ type: CreateExerciseDto })
  @ApiResponse({
    status: 201,
    description: 'Exercise plan generated successfully',
  })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  async generatePlan(@Body(ValidationPipe) dto: CreateExerciseDto) {
    const plan = await this.exerciseService.generateExercisePlan(dto);
    return {
      success: true,
      message: 'Exercise plan generated successfully',
      data: {
        planId: (plan as any)._id,
        planSummary: plan.planSummary,
        weeklySchedule: plan.weeklySchedule,
        totalWeeklyCaloriesBurned: plan.totalWeeklyCaloriesBurned,
        nutritionTips: plan.nutritionTips,
        generalTips: plan.generalTips,
        exercises: plan.exercises,
        categories: {
          cardio: plan.exercises.filter(e => e.category === 'cardio'),
          yoga: plan.exercises.filter(e => e.category === 'yoga'),
          strength: plan.exercises.filter(e => e.category === 'strength'),
          hiit: plan.exercises.filter(e => e.category === 'hiit'),
          flexibility: plan.exercises.filter(e => e.category === 'flexibility'),
        },
      },
    };
  }

  /**
   * GET /exercise/plans
   * Retrieve all stored exercise plans
   */
  @Get('plans')
  @ApiOperation({ summary: 'Get all exercise plans' })
  @ApiResponse({ status: 200, description: 'List of all plans' })
  async getAllPlans() {
    const plans = await this.exerciseService.getAllPlans();
    return {
      success: true,
      count: plans.length,
      data: plans,
    };
  }

  /**
   * GET /exercise/plan/:id
   * Retrieve a single plan by MongoDB ObjectId
   */
  @Get('plan/:id')
  @ApiOperation({ summary: 'Get exercise plan by ID' })
  @ApiParam({ name: 'id', description: 'MongoDB ObjectId of the exercise plan' })
  @ApiResponse({ status: 200, description: 'Exercise plan found' })
  @ApiResponse({ status: 404, description: 'Plan not found' })
  async getPlanById(@Param('id') id: string) {
    const plan = await this.exerciseService.getPlanById(id);
    if (!plan) {
      return { success: false, message: 'Plan not found' };
    }
    return {
      success: true,
      data: plan,
    };
  }
}
