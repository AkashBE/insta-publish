import { Injectable } from '@nestjs/common';
import { IgApiClient } from 'instagram-private-api';
import sharp from 'sharp';
import { WatermarkService } from '../watermark/watermark.service';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class InstagramService {
    private readonly uploadsDir: string;
    private readonly watermarkDir: string;
    private readonly captionTemplate: string;
    private ig: IgApiClient;

    constructor(
        private readonly watermarkService: WatermarkService,
        private configService: ConfigService,
    ) {
        this.uploadsDir = this.configService.get<string>('UPLOADS_DIR');
        this.watermarkDir = this.configService.get<string>('WATERMARK_DIR');
        this.captionTemplate = this.configService.get<string>('CAPTION_TEMPLATE');
        this.ig = new IgApiClient();
    }

    async login(username: string, password: string): Promise<void> {
        this.ig.state.generateDevice(username);
        await this.ig.account.login(username, password);
    }

    async postToInstagram(imagePaths: string[], caption: string, tags: string): Promise<void> {
        try {
            const uniqueId = uuidv4();
            const watermarkedPaths: string[] = [];

            for (const imagePath of imagePaths) {
                const watermarkedPath = `${this.watermarkDir}/${uniqueId}_${uuidv4()}_watermarked.jpg`;
                await this.watermarkService.applyWatermark(imagePath, watermarkedPath);
                watermarkedPaths.push(watermarkedPath);
            }

            const images = await Promise.all(
                watermarkedPaths.map(async (path) => {
                    const imageBuffer = fs.readFileSync(path);

                    const processedImage = await sharp(imageBuffer)
                        .jpeg()
                        .toBuffer();

                    return {
                        file: processedImage,
                        width: 1080,
                        height: 1080,
                    };
                })
            );

            const captionTemplate = fs.readFileSync(this.captionTemplate, 'utf-8');
            const fullCaption = `${caption}${captionTemplate} ${tags}`;

            await this.ig.publish.album({
                items: images.map(image => ({
                    file: image.file,
                    width: image.width,
                    height: image.height,
                })),
                caption: fullCaption.trim(),
            });

            // Clean up temporary files
            // imagePaths.forEach(fs.unlinkSync);
            // watermarkedPaths.forEach(fs.unlinkSync);
        } catch (error) {
            console.error('Error posting to Instagram:', error);
            throw error;
        }
    }
}
