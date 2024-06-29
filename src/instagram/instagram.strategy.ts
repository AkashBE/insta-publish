import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-instagram';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class InstagramStrategy extends PassportStrategy(Strategy, 'instagram') {
    constructor(private readonly configService: ConfigService) {
        super({
            clientID: configService.get('INSTAGRAM_CLIENT_ID'),
            clientSecret: configService.get('INSTAGRAM_CLIENT_SECRET'),
            callbackURL: configService.get('INSTAGRAM_CALLBACK_URL'),
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: any): Promise<any> {
        return { accessToken, profile };
    }
}
