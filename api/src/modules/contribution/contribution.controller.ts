import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { ContributionsService } from './contribution.service';
import { CreateContributionDto } from './dto/create-contribution.dto';
import { UpdateContributionDto } from './dto/update-contribution.dto';
import { TRANSACTION_STATUS } from '@prisma/client';

@Controller('contributions')
export class ContributionsController {
  constructor(private readonly contributionsService: ContributionsService) {}

  @Post()
  create(@Body() dto: CreateContributionDto) {
    return this.contributionsService.create(dto);
  }

  @Get()
  findAll() {
    return this.contributionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contributionsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateContributionDto) {
    return this.contributionsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contributionsService.remove(id);
  }

  @Patch(':id/transaction')
  updateTransaction(@Param('id') id: string, @Body('status') status: TRANSACTION_STATUS) {
    return this.contributionsService.updateTransactionStatus(id, status);
  }
}
