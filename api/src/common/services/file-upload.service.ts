import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import sharp from 'sharp';
import { promises as fs } from 'fs';
import * as path from 'path';


@Injectable()
export class FileUploadService {
  private readonly uploadPath = process.env.UPLOAD_PATH || './uploads';
  private readonly allowedImageMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
  private readonly allowedVideoMimeTypes = ['video/mp4', 'video/webm', 'video/ogg'];
  private readonly maxSizes = {
    avatar: 5 * 1024 * 1024,
    image: 15 * 1024 * 1024,
    video: 50 * 1024 * 1024,
    resume: 5 * 1024 * 1024,
  };
  private readonly categories = ['avatars', 'posts', 'company-logo', 'resumes', 'chat'] as const;

  constructor() {
    this.ensureDirectories();
  }

  private async ensureDirectories() {
    try {
      await Promise.all(this.categories.map(cat => fs.mkdir(path.join(this.uploadPath, cat), { recursive: true })));
    } catch (err) {
      console.error('Failed to create upload directories', err);
      throw new InternalServerErrorException('Failed to initialize file upload service');
    }
  }

  private async ensureUserDirectory(category: string, userId: string) {
    const userPath = path.join(this.uploadPath, category, userId);
    try {
      await fs.mkdir(userPath, { recursive: true });
      return userPath;
    } catch (err) {
      console.error('Failed to create user directory', err);
      throw new InternalServerErrorException('Failed to create user directory');
    }
  }

  private validateFile(file: Express.Multer.File, type: 'avatar' | 'image' | 'video' | 'resume' = 'avatar') {
    if (!file) throw new BadRequestException('File not provided');

    const allowedTypes = type === 'video' ? this.allowedVideoMimeTypes : this.allowedImageMimeTypes;
    const maxSize = this.maxSizes[type];

    if (file.size > maxSize) throw new BadRequestException(`File size exceeds ${maxSize / 1024 / 1024}MB`);
    if (type !== 'resume' && !allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException(`Invalid file type. Allowed: ${allowedTypes.join(', ')}`);
    }
    if (type === 'resume' && file.mimetype !== 'application/pdf') {
      throw new BadRequestException('Resume must be PDF');
    }
  }

  private async saveFile(buffer: Buffer, folderPath: string, fileName: string) {
    const filePath = path.join(folderPath, fileName);
    await fs.writeFile(filePath, buffer);
    return filePath;
  }

  private async optimizeImage(buffer: Buffer) {
    try {
      return await sharp(buffer)
        .resize(400, 400, { fit: 'cover', position: 'center' })
        .jpeg({ quality: 85, progressive: true })
        .toBuffer();
    } catch (err) {
      throw new BadRequestException('Failed to process image');
    }
  }

  private generateFileName(prefix: string, originalName: string) {
    const ext = path.extname(originalName).toLowerCase();
    return `${prefix}-${Date.now()}${ext}`;
  }

  private buildUrl(filePath: string) {
    if (!filePath) return null;
    if (filePath.startsWith('http')) return filePath;

    const baseUrl = process.env.API_BASE_URL || 'http://localhost:3001';
    const apiPrefix = process.env.API_PREFIX || 'api/v1';
    return `${baseUrl}/${apiPrefix}${filePath.startsWith('/') ? '' : '/'}${filePath}`;
  }

  // Generic upload method
  private async upload(
    file: Express.Multer.File,
    userId: string,
    category: typeof this.categories[number],
    prefix: string,
    optimize = false,
  ): Promise<string> {
    try {
      this.validateFile(file, optimize ? 'image' : category === 'posts' ? 'video' : 'avatar');

      const userPath = await this.ensureUserDirectory(category, userId);
      const buffer = optimize ? await this.optimizeImage(file.buffer) : file.buffer;
      const fileName = this.generateFileName(prefix, file.originalname);
      await this.saveFile(buffer, userPath, fileName);

      return `/uploads/${category}/${userId}/${fileName}`;
    } catch (err) {
      if (err instanceof BadRequestException) throw err;
      throw new InternalServerErrorException(`Failed to upload ${prefix}`);
    }
  }

  // Public upload methods
  uploadAvatar(file: Express.Multer.File, userId: string) {
    return this.upload(file, userId, 'avatars', 'avatar', true);
  }

  uploadPostImage(file: Express.Multer.File, userId: string) {
    return this.upload(file, userId, 'posts', 'post');
  }

  uploadPostVideo(file: Express.Multer.File, userId: string) {
    return this.upload(file, userId, 'posts', 'post');
  }

  uploadCompanyLogo(file: Express.Multer.File, userId: string) {
    return this.upload(file, userId, 'company-logo', 'logo');
  }

  uploadResume(file: Express.Multer.File, userId: string) {
    return this.upload(file, userId, 'resumes', 'resume');
  }

  uploadChatAttachment(file: Express.Multer.File, userId: string) {
    return this.upload(file, userId, 'chat', 'attachment');
  }

  async deleteFile(filePath: string) {
    try {
      if (!filePath) return;
      const fullPath = path.join(this.uploadPath, filePath.replace('/uploads/', ''));
      if (await fs.stat(fullPath).catch(() => false)) {
        await fs.unlink(fullPath);
      }
    } catch {}
  }

  getAvatarUrl(filePath: string) {
    return this.buildUrl(filePath);
  }

  getPostMediaUrl(filePath: string) {
    return this.buildUrl(filePath);
  }
}
