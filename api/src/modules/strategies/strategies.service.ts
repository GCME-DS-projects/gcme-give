import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStrategyDto } from './dto/create-strategy.dto';
import { UpdateStrategyDto } from './dto/update-strategy.dto';

@Injectable()
export class StrategiesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateStrategyDto) {
    return this.prisma.strategy.create({ data: dto });
  }

  async findAll() {
    return this.prisma.strategy.findMany({
      include: {
        missionaries: true,
        projects: true,
        contributions: true,
      },
    });
  }

  async findOne(id: string) {
    const strategy = await this.prisma.strategy.findUnique({
      where: { id },
      include: {
        missionaries: true,
        projects: true,
        contributions: true,
      },
    });
    if (!strategy)
      throw new NotFoundException(`Strategy with id ${id} not found`);
    return strategy;
  }

  async update(id: string, dto: UpdateStrategyDto) {
    await this.findOne(id);
    return this.prisma.strategy.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.strategy.delete({ where: { id } });
  }
}
