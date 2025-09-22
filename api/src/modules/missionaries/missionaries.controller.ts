import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MissionariesService } from './missionaries.service';
import { CreateMissionaryDto } from './dto/create-missionary.dto';
import { UpdateMissionaryDto } from './dto/update-missionary.dto';

@Controller('missionaries')
export class MissionariesController {
  constructor(private readonly missionariesService: MissionariesService) {}

  @Post()
  create(@Body() createMissionaryDto: CreateMissionaryDto) {
    return this.missionariesService.create(createMissionaryDto);
  }

  @Get()
  findAll() {
    return this.missionariesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.missionariesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMissionaryDto: UpdateMissionaryDto) {
    return this.missionariesService.update(+id, updateMissionaryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.missionariesService.remove(+id);
  }
}
