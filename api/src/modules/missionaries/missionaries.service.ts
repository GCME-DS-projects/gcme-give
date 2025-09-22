import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMissionaryDto } from './dto/create-missionary.dto';
import { UpdateMissionaryDto } from './dto/update-missionary.dto';

@Injectable()
export class MissionariesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateMissionaryDto) {
    return this.prisma.missionary.create({ data: dto });
  }

  async findAll() {
    return this.prisma.missionary.findMany();
  }

  async findOne(id: string) {
    const missionary = await this.prisma.missionary.findUnique({ where: { id } });
    if (!missionary) throw new NotFoundException(`Missionary with id ${id} not found`);
    return missionary;
  }

  async update(id: string, dto: UpdateMissionaryDto) {
    await this.findOne(id);
    return this.prisma.missionary.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.missionary.update({ where: { id }, data: { isDeleted: true } });
  }
}
