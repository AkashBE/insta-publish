import { Injectable } from '@nestjs/common';
import { IgApiClient } from 'instagram-private-api';
import axios from 'axios';
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

    async downloadImage(url: string, outputPath: string) {
        const response = await axios({
            url,
            responseType: 'stream',
        });

        return new Promise<void>((resolve, reject) => {
            const writer = fs.createWriteStream(outputPath);
            response.data.pipe(writer);
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
    }

    async postToInstagram(imageUrl: string, caption: string, tags: string): Promise<void> {
        try {
            const uniqueId = uuidv4();
            const imagePath = `${this.uploadsDir}/${uniqueId}_original.jpg`;
            const watermarkedPath = `${this.watermarkDir}/${uniqueId}_watermarked.jpg`;
            await this.downloadImage(imageUrl, imagePath);

            /* legacy code to load image buffer from url
            const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
            const imageBuffer = Buffer.from(response.data, 'binary');
            */

            await this.watermarkService.applyWatermark(imagePath, watermarkedPath);

            const imageBuffer = fs.readFileSync(watermarkedPath);

            const processedImage = await sharp(imageBuffer).jpeg().toBuffer();

            // Construct the caption with multiple lines
            const fullCaption = `${caption}${this.configService.get<string>('CAPTION_TEMPLATE')} ${tags}
`;
            await this.ig.publish.photo({
                file: processedImage,
                caption: fullCaption.trim(),
            });
            // fs.unlinkSync(imagePath);
            // fs.unlinkSync(watermarkedPath);
        } catch (error) {
            console.error('Error posting to Instagram:', error);
            throw error;
        }
    }
}
