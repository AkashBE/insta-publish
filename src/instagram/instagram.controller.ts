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

    @Post('postImage')
    @ApiOperation({ summary: 'Post an image to Instagram' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                image: {
                    type: 'string',
                    format: 'binary',
                },
                caption: { type: 'string', example: 'caption' },
                tags: { type: 'string', example: 'tags' },
            },
        },
    })
    @ApiResponse({ status: 200, description: 'Image posted successfully to Instagram!' })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async postImageToInstagram(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction): Promise<void> {
        this.upload.single('image')(req, res, async (err) => {
            if (err) {
                console.error('Error uploading image:', err);
                res.status(500).send('Failed to upload image');
                return;
            }

            try {
                const file = req.file;
                const { caption, tags } = req.body;

                if (!file) {
                    res.status(400).send('No image file provided');
                    return;
                }

                await this.instagramService.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);
                await this.instagramService.postToInstagram(file.path, caption, tags);
                res.status(200).send('Image posted successfully to Instagram!');
            } catch (error) {
                console.error('Error posting image:', error);
                res.status(500).send('Failed to post image to Instagram');
            }
        });
    }
}
