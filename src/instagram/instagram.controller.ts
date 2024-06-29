import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { InstagramService } from './instagram.service';

@ApiTags('Instagram')
@Controller('instagram')
export class InstagramController {
    constructor(private readonly instagramService: InstagramService) { }

    @Get('auth')
    @UseGuards(AuthGuard('instagram'))
    async authenticate() { }

    @Get('auth/callback')
    @UseGuards(AuthGuard('instagram'))
    async authCallback(@Req() req, @Res() res) {
        const { accessToken } = await this.instagramService.handleAuthCallback(req);
        // Redirect or respond as needed
    }
}
