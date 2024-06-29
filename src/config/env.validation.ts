import { plainToClass } from 'class-transformer';
import { validateSync, IsString, IsNumber, IsOptional } from 'class-validator';

export class EnvironmentVariables {
    @IsString()
    NODE_ENV: string;

    @IsNumber()
    PORT: number;

    @IsString()
    INSTAGRAM_CLIENT_ID: string;

    @IsString()
    INSTAGRAM_CLIENT_SECRET: string;

    @IsString()
    INSTAGRAM_CALLBACK_URL: string;

    @IsString()
    SESSION_SECRET: string;

    @IsString()
    LOGO_PATH: string;

    @IsString()
    UPLOADS_DIR: string;

    @IsString()
    WATERMARK_DIR: string;
}

export function validate(config: Record<string, unknown>) {
    const validatedConfig = plainToClass(EnvironmentVariables, config, {
        enableImplicitConversion: true,
    });
    const errors = validateSync(validatedConfig, {
        skipMissingProperties: false,
    });

    if (errors.length > 0) {
        throw new Error(errors.toString());
    }
    return validatedConfig;
}