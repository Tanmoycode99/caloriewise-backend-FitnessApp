import { Controller, Post, Param, Body } from '@nestjs/common';
import { FitnessService } from './fitness.service';
import { CreateFitnessDto } from './create-fitness.dto';

@Controller('fitness')
export class FitnessController {
  constructor(private readonly fitnessService: FitnessService) {}

  @Post(':userId')
calculateFitness(
  @Param('userId') userId: string,
  @Body() dto: CreateFitnessDto
)
 {
    return this.fitnessService.calculate(userId, dto);
  }
}
