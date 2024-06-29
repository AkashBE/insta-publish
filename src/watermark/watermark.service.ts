import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import sharp from 'sharp';

@Injectable()
export class WatermarkService {
    private readonly logoPath: string;
    private readonly logoText: string;

    constructor(private configService: ConfigService) {
        this.logoPath = this.configService.get<string>('LOGO_PATH');
        this.logoText = this.configService.get<string>('LOGO_TEXT');
    }

    async applyWatermark(inputPath: string, outputPath: string): Promise<void> {
        const [image, logo] = await Promise.all([
            sharp(inputPath).toBuffer(),
            sharp(this.logoPath)
                .resize(50, 50) // Adjust logo size as needed
                .toBuffer(),
        ]);

        const { width, height } = await sharp(image).metadata();
        const padding = 200;
        const verticalPosition = height - 400;
        const isLeft = Math.random() < 0.5;
        const horizontalPosition = isLeft ? padding : width - padding - 50 - this.logoText.length * 12; // Adjusting for text width

        const svgText = `
        <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
          <style>
            .title { font-family: 'Roboto Condensed', sans-serif; font-size: 48px; font-weight: bold; fill: white; fill-opacity: 0.3; }
          </style>
          <text x="${horizontalPosition + 60}" y="${verticalPosition + 35}" class="title">${this.logoText}</text>
        </svg>
      `;

        const logoWithTransparency = await sharp(logo)
            .composite([{ input: Buffer.from(`<svg><rect x="0" y="0" width="50" height="50" fill="white" fill-opacity="0.1"/></svg>`), blend: 'over' }])
            .toBuffer();

        const watermarkedImage = await sharp(image)
            .composite([
                { input: logoWithTransparency, left: horizontalPosition, top: verticalPosition },
                { input: Buffer.from(svgText), top: 0, left: 0 },
            ])
            .toBuffer();

        await sharp(watermarkedImage).toFile(outputPath);
    }
}