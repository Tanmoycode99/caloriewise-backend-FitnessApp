import { Controller, Post, Body } from '@nestjs/common';
import { FitnessService } from './fitness.service';
import { CreateFitnessDto } from './create-fitness.dto';

@Controller('fitness')
export class FitnessController {
  constructor(private readonly fitnessService: FitnessService) {}

  @Post()
  calculateFitness(@Body() dto: CreateFitnessDto) {
    return this.fitnessService.calculate(dto.userId, dto);
  }
}