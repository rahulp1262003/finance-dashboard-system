import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { FinancialRecordService } from './financial-record.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from 'src/auth/dto/register.dto';
import { RolesGuard } from 'src/auth/roles.guard';
import { UpdateFinancialRecordDto } from './dto/update-financial-record.dto';
import { CreateFinancialRecordDto } from './dto/create-financial-record.dto';

@Controller('financial-record')
@UseGuards(AuthGuard, RolesGuard)
export class FinancialRecordController {
  constructor(private readonly financialRecordService: FinancialRecordService) { }

  @Post()
  @Roles(UserRole.ADMIN)
  create(@Request() req, @Body() createFinancialRecordDto: CreateFinancialRecordDto) {
    const userId = req.user.sub;
    return this.financialRecordService.create(userId, createFinancialRecordDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.ANALYST, UserRole.VIEWER)
  findAll(@Request() req) {
    const userId = req.user.sub;
    return this.financialRecordService.findAll(userId);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.ANALYST, UserRole.VIEWER)
  findOne(@Param('id') id: string, @Request() req) {
    const userId = req.user.sub;
    return this.financialRecordService.findOne(id, userId);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.ANALYST)
  update(@Param('id') id: string, @Request() req, @Body() updateFinancialRecordDto: UpdateFinancialRecordDto) {
    const userId = req.user.sub;
    return this.financialRecordService.update(id, userId, updateFinancialRecordDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string, @Request() req) {
    const userId = req.user.sub;
    return this.financialRecordService.remove(id, userId);
  }
}
