import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMissionaryDto } from './dto/create-missionary.dto';
import { UpdateMissionaryDto } from './dto/update-missionary.dto';
import { QueryMissionaryDto } from './dto/query-missionary.dto';

@Injectable()
export class MissionariesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateMissionaryDto) {
    const missionary = await this.prisma.missionary.create({
      data: { ...dto },
    });
    return missionary;
  }

  async findAll(query: QueryMissionaryDto) {
    const { search, status, type, role, region } = query;

    return this.prisma.missionary.findMany({
      where: {
        isDeleted: false,
        ...(status && { status }),
        ...(type && { type }),
        ...(role && { role }),
        ...(region && { region }),
        ...(search && {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { shortBio: { contains: search, mode: 'insensitive' } },
            { fullBio: { contains: search, mode: 'insensitive' } },
            { location: { contains: search, mode: 'insensitive' } },
          ],
        }),
      },
    });
  }

  async findOne(id: string) {
    const missionary = await this.prisma.missionary.findUnique({
      where: { id },
    });
    if (!missionary)
      throw new NotFoundException(`Missionary with id ${id} not found`);
    return missionary;
  }

  async update(id: string, dto: UpdateMissionaryDto) {
    const missionary = await this.prisma.missionary.findUnique({
      where: { id },
    });
    if (!missionary)
      throw new NotFoundException(`Missionary with id ${id} not found`);

    return this.prisma.missionary.update({
      where: { id },
      data: { ...dto },
    });
  }

  async remove(id: string) {
    const missionary = await this.prisma.missionary.findUnique({
      where: { id },
    });
    if (!missionary)
      throw new NotFoundException(`Missionary with id ${id} not found`);

    return this.prisma.missionary.update({
      where: { id },
      data: { isDeleted: true },
    });
  }
}
