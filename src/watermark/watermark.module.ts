import { Module } from '@nestjs/common';
import { WatermarkController } from './watermark.controller';
import { WatermarkService } from './watermark.service';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [WatermarkController],
  providers: [WatermarkService, ConfigService],
  exports: [WatermarkService],
})
export class WatermarkModule { }
