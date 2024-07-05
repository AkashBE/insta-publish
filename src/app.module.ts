import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { InstagramModule } from './instagram/instagram.module';
import { WatermarkModule } from './watermark/watermark.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    InstagramModule,
    WatermarkModule,
  ],
  providers: [],
})
export class AppModule { }
