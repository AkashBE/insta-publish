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
    private ig: IgApiClient;

    constructor(
        private readonly watermarkService: WatermarkService,
        private configService: ConfigService,
    ) {
        this.uploadsDir = this.configService.get<string>('UPLOADS_DIR');
        this.watermarkDir = this.configService.get<string>('WATERMARK_DIR');
        this.ig = new IgApiClient();
    }

    async login(username: string, password: string): Promise<void> {
        this.ig.state.generateDevice(username);
        await this.ig.account.login(username, password);
    }

    async postToInstagram(imagePath: string, caption: string, tags: string): Promise<void> {
        try {
            const uniqueId = uuidv4();
            const watermarkedPath = `${this.watermarkDir}/${uniqueId}_watermarked.jpg`; // Change to jpg

            await this.watermarkService.applyWatermark(imagePath, watermarkedPath);

            const imageBuffer = fs.readFileSync(watermarkedPath);

            // Convert image to JPEG and ensure it's within allowed size
            const processedImage = await sharp(imageBuffer)
                .jpeg() // Convert to JPEG with 80% quality
                .toBuffer();

            // Construct the caption with multiple lines
            const fullCaption = `${caption}${this.configService.get<string>('CAPTION_TEMPLATE')} ${tags}`;

            await this.ig.publish.photo({
                file: processedImage,
                caption: fullCaption.trim(),
            });

            // Clean up temporary files
            // fs.unlinkSync(imagePath);
            // fs.unlinkSync(watermarkedPath);
        } catch (error) {
            console.error('Error posting to Instagram:', error);
            throw error;
        }
    }
}
