import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateProjectDto) {
    return this.prisma.projects.create({ data: dto });
  }

  async findAll() {
    return this.prisma.projects.findMany({
      where: { isDeleted: false },
      include: {
        Strategy: true,
        contributions: true,
      },
    });
  }

  async findOne(id: string) {
    const project = await this.prisma.projects.findUnique({
      where: { id },
      include: {
        Strategy: true,
        contributions: true,
      },
    });
    if (!project)
      throw new NotFoundException(`Project with id ${id} not found`);
    return project;
  }

  async update(id: string, dto: UpdateProjectDto) {
    await this.findOne(id);
    return this.prisma.projects.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.projects.update({
      where: { id },
      data: { isDeleted: true },
    });
  }
}
