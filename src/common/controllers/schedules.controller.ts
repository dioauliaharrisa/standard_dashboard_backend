import { Controller, Post, Body, Get } from '@nestjs/common';
import {
  CreateScheduleDto,
  ScheduleService,
} from '../services/schedule.service';

@Controller('schedules')
export class SchedulesController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Get('get-today-schedule')
  async getTodaySchedule() {
    return await this.scheduleService.getTodaySchedule();
  }

  @Post('create')
  async createSchedule(@Body() body: CreateScheduleDto) {
    return await this.scheduleService.createSchedule(body);
  }
}
