import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContributionDto } from './dto/create-contribution.dto';
import { UpdateContributionDto } from './dto/update-contribution.dto';
import { TRANSACTION_STATUS } from '@prisma/client';

@Injectable()
export class ContributionsService {
  constructor(private prisma: PrismaService) {}

  // Create a contribution with optional transaction
  async create(dto: CreateContributionDto) {
    // Validate target
    if (!dto.projectId && !dto.missionaryId && !dto.strategyId) {
      throw new BadRequestException('Contribution must target a project, missionary, or strategy.');
    }

    // Check existence of target(s)
    if (dto.projectId) {
      const project = await this.prisma.projects.findUnique({ where: { id: dto.projectId } });
      if (!project) throw new NotFoundException(`Project ${dto.projectId} not found`);
    }

    if (dto.missionaryId) {
      const missionary = await this.prisma.missionary.findUnique({ where: { id: dto.missionaryId } });
      if (!missionary) throw new NotFoundException(`Missionary ${dto.missionaryId} not found`);
    }

    if (dto.strategyId) {
      const strategy = await this.prisma.strategy.findUnique({ where: { id: dto.strategyId } });
      if (!strategy) throw new NotFoundException(`Strategy ${dto.strategyId} not found`);
    }

    // Create contribution
    const contribution = await this.prisma.contribution.create({ data: { ...dto, status: dto.status || TRANSACTION_STATUS.PENDING } });

    // Optionally create transaction record
    if (dto.paymentMethod) {
      await this.prisma.transaction.create({
        data: {
          contributionId: contribution.id,
          paymentMethod: dto.paymentMethod,
          status: TRANSACTION_STATUS.PENDING,
        },
      });
    }

    return this.findOne(contribution.id);
  }

  async findAll() {
    return this.prisma.contribution.findMany({
      where: { isDeleted: false },
      include: {
        contributor: true,
        project: true,
        missionary: true,
        strategy: true,
        transaction: true,
      },
    });
  }

  async findOne(id: string) {
    const contribution = await this.prisma.contribution.findUnique({
      where: { id },
      include: {
        contributor: true,
        project: true,
        missionary: true,
        strategy: true,
        transaction: true,
      },
    });
    if (!contribution) throw new NotFoundException(`Contribution ${id} not found`);
    return contribution;
  }

  async update(id: string, dto: UpdateContributionDto) {
    await this.findOne(id);
    return this.prisma.contribution.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.contribution.update({ where: { id }, data: { isDeleted: true } });
  }

  // Update transaction status
  async updateTransactionStatus(contributionId: string, status: TRANSACTION_STATUS) {
    const transaction = await this.prisma.transaction.findUnique({ where: { contributionId } });
    if (!transaction) throw new NotFoundException(`Transaction for contribution ${contributionId} not found`);
    return this.prisma.transaction.update({ where: { contributionId }, data: { status } });
  }
}
