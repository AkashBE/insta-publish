```markdown
# Watermark Service API

This project is a Nest.js application that provides an API to upload images, apply watermarks, and manage uploaded and watermarked images. It includes functionalities to clear the directories where the images are stored.

## Table of Contents

- [Installation](#installation)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
  - [Upload Image and Apply Watermark](#upload-image-and-apply-watermark)
  - [Clear Directories](#clear-directories)
- [Environment Variables](#environment-variables)
- [DTOs](#dtos)
  - [UploadDto](#uploaddto)
  - [ClearDirsDto](#cleardirsdto)
- [Service Methods](#service-methods)
- [License](#license)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/watermark-service.git
   cd watermark-service
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root of your project and add the necessary environment variables:

   ```
   NODE_ENV=development
   PORT=3000
   UPLOADS_DIR=./uploads
   WATERMARK_DIR=./watermarked
   ```

## Running the Application

To start the application, run:

```bash
npm run start
```

The application will be available at `http://localhost:3000`.

## API Endpoints

### Upload Image and Apply Watermark

- **Endpoint:** `POST /watermark/upload`
- **Description:** Uploads an image and applies a watermark.
- **Consumes:** `multipart/form-data`
- **Request Body:**
  - `image` (file): The image to upload and watermark.
  - `text` (string): The text to include in the watermark.
- **Response:**
  - `201 Created`: Image watermarked successfully.
  - `400 Bad Request`: File upload error or no file uploaded.

### Clear Directories

- **Endpoint:** `DELETE /watermark/clear`
- **Description:** Clears the `uploads` and/or `watermarked` directories based on the selected options.
- **Request Body:** `ClearDirsDto`
  - `clearUploads` (boolean): Clear the `uploads` directory (default: true).
  - `clearWatermarked` (boolean): Clear the `watermarked` directory (default: true).
- **Response:**
  - `200 OK`: Selected directories cleared successfully.
  - `500 Internal Server Error`: Error clearing directories.

## Environment Variables

- `NODE_ENV`: The environment in which the application is running.
- `PORT`: The port on which the application will run.
- `UPLOADS_DIR`: The directory where uploaded images are stored.
- `WATERMARK_DIR`: The directory where watermarked images are stored.

## DTOs

### UploadDto

Used for uploading an image and applying a watermark.

```typescript
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UploadDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  image: any;

  @ApiProperty({ description: 'Text to include in the watermark' })
  @IsString()
  text: string;
}
```

### ClearDirsDto

Used for selecting which directories to clear.

```typescript
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
```

## Service Methods

### WatermarkService

- **applyWatermark(inputPath: string, outputPath: string, text: string): Promise<void>**
  - Applies a watermark to the uploaded image and saves it to the specified output path.

- **clearDirectories(dirPath: string): Promise<void>**
  - Clears the specified directory.

## License

This project is licensed under the MIT License.
```

This README provides an overview of the application's functionality, installation steps, running instructions, and detailed information about the API endpoints, environment variables, DTOs, and service methods.