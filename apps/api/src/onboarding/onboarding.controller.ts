import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { OnboardingService } from './onboarding.service';

@Controller('onboarding')
export class OnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  @Post('start')
  async start(@Body() body: { tenantName: string; adminEmail: string; adminPassword: string }) {
    return this.onboardingService.start(body);
  }

  @Get(':tenantId')
  async getProgress(@Param('tenantId') tenantId: string) {
    return this.onboardingService.getProgress(Number(tenantId));
  }
}
