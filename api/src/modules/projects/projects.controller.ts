import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import * as nestjsBetterAuth from '@thallesp/nestjs-better-auth';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from 'src/common/services/file-upload.service';

@Controller('projects')
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly fileUploadService: FileUploadService,
  ) {}

  @Post()
  create(@Body() dto: CreateProjectDto) {
    return this.projectsService.create(dto);
  }

  @Post('upload/image')
   @UseGuards(nestjsBetterAuth.AuthGuard)
    @UseInterceptors(FileInterceptor('image'))
    async uploadImage(
      @UploadedFile() file: Express.Multer.File,
      @nestjsBetterAuth.Session() session: nestjsBetterAuth.UserSession
    ) {
      if (!session?.user?.id) {
        console.error('User session not found or invalid:', session);
        throw new BadRequestException('User session not found. Please login.');
      }
  
      console.log('Uploaded file:', file);
      if (!file) throw new BadRequestException('No file uploaded');
  
      const imagePath = await this.fileUploadService.upload(file, session.user.id, 'projects', 'projects');
      console.log('Image uploaded to path:', imagePath);
      console.log("image url:", this.fileUploadService.getMediaUrl(imagePath));
  
      return {
        imageUrl: this.fileUploadService.getMediaUrl(imagePath),
      };
    }

  @Get()
  findAll() {
    return this.projectsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProjectDto) {
    return this.projectsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectsService.remove(id);
  }
}
