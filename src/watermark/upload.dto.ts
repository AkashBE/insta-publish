import { ApiProperty } from '@nestjs/swagger';

export class UploadDto {
    @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' }, description: 'Images to upload' })
    images: any[];
}