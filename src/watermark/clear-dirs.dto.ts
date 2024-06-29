import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class ClearDirsDto {
    @ApiProperty({ description: 'Clear uploads directory', default: true })
    @IsOptional()
    @IsBoolean()
    clearUploads: boolean;

    @ApiProperty({ description: 'Clear watermarked directory', default: true })
    @IsOptional()
    @IsBoolean()
    clearWatermarked: boolean;
}