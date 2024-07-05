import { Controller, Post, Body, Delete, Req, Res } from '@nestjs/common';
import { ApiConsumes, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { WatermarkService } from './watermark.service';
import { UploadDto } from './upload.dto';
import { ConfigService } from '@nestjs/config';
import { diskStorage } from 'multer';
import multer from 'multer';
import * as fs from 'fs-extra';
import { ClearDirsDto } from './clear-dirs.dto';
import { Request, Response } from 'express';

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
    @ApiOperation({ summary: 'Upload images and apply watermark' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'Images to upload and watermark',
        type: UploadDto,
    })
    @ApiResponse({ status: 201, description: 'Images watermarked successfully' })
    async uploadImages(@Req() req: Request, @Res() res: Response) {
        this.upload.array('images', 10)(req, res, async (err: any) => {
            if (err) {
                return res.status(400).json({ message: 'File upload error', error: err.message });
            }

            const files = req.files as Express.Multer.File[];
            if (!files || files.length === 0) {
                return res.status(400).json({ message: 'No files uploaded' });
            }

            const promises = files.map(file => {
                const outputPath = `${this.watermarkDir}/${file.filename}`;
                return this.watermarkService.applyWatermark(file.path, outputPath);
            });

            await Promise.all(promises);

            return res.status(201).json({ message: 'Images watermarked successfully' });
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
        const { clearUploads = true, clearWatermarked = true } = clearDirsDto;

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