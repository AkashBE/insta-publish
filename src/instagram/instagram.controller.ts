import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { InstagramService } from './instagram.service';

@ApiTags('Instagram')
@Controller('instagram')
export class InstagramController {
    constructor(private readonly instagramService: InstagramService) { }

    @Post('postImage')
    @ApiOperation({ summary: 'Post an image to Instagram' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                imageUrl: { type: 'string', example: 'url' },
                caption: { type: 'string', example: 'caption' },
                tags: { type: 'string', example: 'tags' },
            },
        },
    })
    @ApiResponse({ status: 200, description: 'Image posted successfully to Instagram!' })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async postImageToInstagram(@Body() body: { imageUrl: string; caption: string, tags: string }): Promise<string> {
        try {
            await this.instagramService.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);
            await this.instagramService.postToInstagram(body.imageUrl, body.caption, body.tags);
            return 'Image posted successfully to Instagram!';
        } catch (error) {
            console.error('Error posting image:', error);
            throw new Error('Failed to post image to Instagram');
        }
    }
}
