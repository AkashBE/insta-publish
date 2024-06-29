// src/instagram/instagram.module.ts

import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { InstagramController } from './instagram.controller';
import { InstagramService } from './instagram.service';
import { InstagramStrategy } from './instagram.strategy';

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'instagram' }), // Register Passport with Instagram strategy
        ConfigModule, // Import ConfigModule to use ConfigService
    ],
    controllers: [InstagramController], // Register Instagram controller
    providers: [
        InstagramService, // Register Instagram service
        InstagramStrategy, // Register Instagram Passport strategy
        ConfigService, // Register ConfigService for environment variables
    ],
    exports: [ConfigService], // Export ConfigService to be available in other modules if needed
})
export class InstagramModule { }
