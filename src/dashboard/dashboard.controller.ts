import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from 'src/auth/dto/register.dto';

@Controller('api/dashboard')
@UseGuards(AuthGuard, RolesGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) { }

  @Get('summary')
  @Roles(UserRole.ADMIN, UserRole.ANALYST, UserRole.VIEWER)
  getSummary(@Request() req) {
    const userId = req.user.sub;
    return this.dashboardService.getSummary(userId);
  }

  @Get('by-category')
  @Roles(UserRole.ADMIN, UserRole.ANALYST)
  getByCategory(@Request() req) {
    const userId = req.user.sub;
    return this.dashboardService.getByCategory(userId);
  }

  @Get('trends')
  @Roles(UserRole.ADMIN, UserRole.ANALYST)
  getTrends(@Request() req, @Query('period') period: 'monthly' | 'weekly') {
    const userId = req.user.sub;
    return this.dashboardService.getTrends(userId, period ?? 'monthly');
  }

  @Get('recent')
  @Roles(UserRole.ADMIN, UserRole.ANALYST, UserRole.VIEWER)
  getRecent(@Request() req) {
    const userId = req.user.sub;
    return this.dashboardService.getRecent(userId);
  }
}