import { Controller, Post, Req, Res, Body, Delete } from '@nestjs/common';
import { diskStorage } from 'multer';
import multer from 'multer';
import { ApiConsumes, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { WatermarkService } from './watermark.service';
import { UploadDto } from './upload.dto';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import * as fs from 'fs-extra';
import { ClearDirsDto } from './clear-dirs.dto';

@ApiTags('watermark')
@Controller('watermark')
export class WatermarkController {
    private readonly uploadsDir: string;
    private readonly watermarkDir: string;
    private readonly upload: multer.Multer;

    constructor(
        private readonly watermarkService: WatermarkService,
        private configService: ConfigService,
    ) {
        this.uploadsDir = this.configService.get<string>('UPLOADS_DIR');
        this.watermarkDir = this.configService.get<string>('WATERMARK_DIR');
        const storage = diskStorage({
            destination: (req, file, cb) => {
                cb(null, this.uploadsDir);
            },
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                cb(null, uniqueSuffix + '-' + file.originalname);
            },
        });

        this.upload = multer({ storage });
    }

    @Post('upload')
    @ApiOperation({ summary: 'Upload an image and apply watermark' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'Image to upload and watermark text',
        type: UploadDto,
    })
    @ApiResponse({ status: 201, description: 'Image watermarked successfully' })
    async uploadImage(@Req() req: Request, @Res() res: Response) {
        this.upload.single('image')(req, res, async (err: any) => {
            if (err) {
                return res.status(400).json({ message: 'File upload error', error: err.message });
            }

            const file = req.file;
            if (!file) {
                return res.status(400).json({ message: 'No file uploaded' });
            }

            const outputPath = `${this.watermarkDir}/${file.filename}`;
            await this.watermarkService.applyWatermark(file.path, outputPath);
            return res.status(201).json({ message: 'Image watermarked successfully', path: outputPath });
        });
    }

    @Delete('clear')
    @ApiOperation({ summary: 'Clear uploads and/or watermarked directories' })
    @ApiBody({
        description: 'Select directories to clear',
        type: ClearDirsDto,
    })
    @ApiResponse({ status: 200, description: 'Directories cleared successfully' })
    async clearDirectories(@Body() clearDirsDto: ClearDirsDto) {
        const { clearUploads, clearWatermarked } = clearDirsDto;

        try {
            if (clearUploads) {
                await fs.emptyDir(this.uploadsDir);
            }
            if (clearWatermarked) {
                await fs.emptyDir(this.watermarkDir);
            }

            return { message: 'Selected directories cleared successfully' };
        } catch (err) {
            return { message: 'Error clearing directories', error: err.message };
        }
    }
}