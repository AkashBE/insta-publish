import { Injectable } from '@nestjs/common';
import { IgApiClient } from 'instagram-private-api';
import axios from 'axios';
import sharp from 'sharp';

@Injectable()
export class InstagramService {
    private ig: IgApiClient;

    constructor() {
        this.ig = new IgApiClient();
    }

    async login(username: string, password: string): Promise<void> {
        this.ig.state.generateDevice(username);
        await this.ig.account.login(username, password);
    }

    async postToInstagram(imageUrl: string, caption: string, tags: string): Promise<void> {
        try {
            const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
            const imageBuffer = Buffer.from(response.data, 'binary');
            const processedImage = await sharp(imageBuffer)
                .jpeg()
                .toBuffer();

            // Construct the caption with multiple lines
            const fullCaption = `${caption}
.
.
.
.
°✩₊☾₊✩°｡⋆⋆｡°✩₊☾₊✩°｡⋆⋆｡°✩₊☾₊✩°

Follow @glowtail.ai for more!  ❤

°✩₊☾₊✩°｡⋆⋆｡°✩₊☾₊✩°｡⋆⋆｡°✩₊☾₊✩°

Hi-Res wallpapers are available in my Kofi page ❤
.
.
.
.
#aiart #midjourney ${tags}
`;
            await this.ig.publish.photo({
                file: processedImage,
                caption: fullCaption.trim(),
            });

        } catch (error) {
            console.error('Error posting to Instagram:', error);
            throw error;
        }
    }
}
