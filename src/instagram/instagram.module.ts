import { Module } from '@nestjs/common';
import { InstagramController } from './instagram.controller';
import { InstagramService } from './instagram.service';
import { WatermarkModule } from '../watermark/watermark.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [WatermarkModule, ConfigModule],
  controllers: [InstagramController],
  providers: [InstagramService]
})
export class InstagramModule { }
