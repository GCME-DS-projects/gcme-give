import { Injectable } from '@nestjs/common';
import { CreateMissionaryDto } from './dto/create-missionary.dto';
import { UpdateMissionaryDto } from './dto/update-missionary.dto';

@Injectable()
export class MissionariesService {
  create(createMissionaryDto: CreateMissionaryDto) {
    return 'This action adds a new missionary';
  }

  findAll() {
    return `This action returns all missionaries`;
  }

  findOne(id: number) {
    return `This action returns a #${id} missionary`;
  }

  update(id: number, updateMissionaryDto: UpdateMissionaryDto) {
    return `This action updates a #${id} missionary`;
  }

  remove(id: number) {
    return `This action removes a #${id} missionary`;
  }
}
