import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { InstagramModule } from './instagram/instagram.module';
import { InstagramStrategy } from './instagram/instagram.strategy';
import { WatermarkModule } from './watermark/watermark.module';
import { validate } from './config/env.validation';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PassportModule.register({ defaultStrategy: 'instagram' }),
    InstagramModule,
    WatermarkModule,
  ],
  providers: [InstagramStrategy],
})
export class AppModule { }
