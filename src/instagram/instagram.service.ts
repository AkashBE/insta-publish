// src/instagram/instagram.service.ts

import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { User } from './interfaces/user.interface';

@Injectable()
export class InstagramService {
    constructor(private readonly configService: ConfigService) { }

    async handleAuthCallback(req): Promise<User> {
        // Handle authentication callback logic
        const { accessToken, profile } = req.user;
        return { accessToken, ...profile };
    }

    async uploadImage(image: Express.Multer.File, caption: string, accessToken: string): Promise<void> {
        // Convert Buffer to Blob
        const blob = new Blob([image.buffer], { type: image.mimetype });

        // Create FormData and append data
        const formData = new FormData();
        formData.append('image', blob, image.originalname);
        formData.append('caption', caption);

        try {
            const response = await axios.post('https://graph.instagram.com/me/media', formData, {
                params: {
                    access_token: accessToken,
                },
                headers: {
                    'Content-Type': 'multipart/form-data', // Set content type as multipart form data
                },
            });

            // Handle success or error responses
            console.log('Instagram API response:', response.data);
        } catch (error) {
            console.error('Error uploading image to Instagram:', error.response?.data || error.message);
            throw error;
        }
    }
}
