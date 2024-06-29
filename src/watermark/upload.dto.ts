import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UploadDto {
    @ApiProperty({ type: 'string', format: 'binary' })
    image: any;

    @ApiProperty({ description: 'Text to be added as watermark' })
    @IsString()
    text: string;
}