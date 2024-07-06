import { Controller, Post, Body, Req, Res, Next } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse, ApiConsumes } from '@nestjs/swagger';
import { InstagramService } from './instagram.service';
import multer, { diskStorage } from 'multer';
import { ConfigService } from '@nestjs/config';
import { extname } from 'path';
import { Request, Response, NextFunction } from 'express';

@ApiTags('Instagram')
@Controller('instagram')
export class InstagramController {
    private readonly upload: multer.Multer;
    private readonly uploadsDir: string;

    constructor(
        private readonly instagramService: InstagramService,
        private configService: ConfigService,
    ) {
        this.uploadsDir = this.configService.get<string>('UPLOADS_DIR');

        const storage = diskStorage({
            destination: (req, file, cb) => {
                cb(null, this.uploadsDir);
            },
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + extname(file.originalname);
                cb(null, uniqueSuffix);
            },
        });

        this.upload = multer({ storage });
    }

    @Post('postImages')
    @ApiOperation({ summary: 'Post multiple images to Instagram as an album' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                images: {
                    type: 'array',
                    items: {
                        type: 'string',
                        format: 'binary',
                    },
                },
                caption: { type: 'string', example: 'caption' },
                tags: { type: 'string', example: 'tags' },
            },
        },
    })
    @ApiResponse({ status: 200, description: 'Images posted successfully to Instagram!' })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async postImagesToInstagram(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction): Promise<void> {
        this.upload.array('images')(req, res, async (err) => {
            if (err) {
                console.error('Error uploading images:', err);
                res.status(500).send('Failed to upload images');
                return;
            }

            try {
                const files = req.files as Express.Multer.File[];
                const { caption, tags } = req.body;

                if (!files || files.length === 0) {
                    res.status(400).send('No image files provided');
                    return;
                }

                const imagePaths = files.map(file => file.path);

                await this.instagramService.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);
                await this.instagramService.postToInstagram(imagePaths, caption, tags);
                res.status(200).send('Images posted successfully to Instagram!');
            } catch (error) {
                console.error('Error posting images:', error);
                res.status(500).send('Failed to post images to Instagram');
            }
        });
    }
}
