```markdown
# Instagram Posting Service with Watermark

This NestJS application provides a service to watermark images and post them to Instagram. The service can handle image watermarking with a custom logo and text, and then publish the watermarked image to Instagram. It includes functionalities to upload images, apply watermarks, manage uploaded and watermarked images, and clear the directories where the images are stored.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
  - [Upload Image and Apply Watermark](#upload-image-and-apply-watermark)
  - [Post Image to Instagram](#post-image-to-instagram)
  - [Clear Directories](#clear-directories)
- [Environment Variables](#environment-variables)
- [DTOs](#dtos)
  - [UploadDto](#uploaddto)
  - [ClearDirsDto](#cleardirsdto)
- [Service Methods](#service-methods)
- [PM2 Setup](#pm2-setup)
- [Development](#development)
- [License](#license)

## Features

- Watermark images with a custom logo and text.
- Post images to Instagram.
- Read captions from a template file.
- Swagger UI for API documentation.
- PM2 configuration for process management.

## Installation

### Prerequisites

- Node.js
- npm

### Steps

1. Clone the repository:

    ```bash
    git clone <repository_url>
    cd <repository_directory>
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Install global dependencies:

    ```bash
    npm install -g @nestjs/cli ts-node tsconfig-paths nodemon pm2
    ```

## Configuration

### Environment Variables

Create a `.env` file in the root directory with the following content:

```env
NODE_ENV=development
PORT=4000
IG_USERNAME=your_instagram_username
IG_PASSWORD=your_instagram_password
LOGO_PATH=path_to_logo_file
LOGO_TEXT=YourLogoText
CAPTION_TEMPLATE=caption-template.txt
UPLOADS_DIR=./uploads
WATERMARK_DIR=./watermarked
```

### Nodemon Configuration

Create a `nodemon.json` file in the root directory:

```json
{
  "watch": ["src", ".env"],
  "ext": "ts,js,json,env",
  "ignore": ["node_modules"],
  "exec": "ts-node -r tsconfig-paths/register src/main.ts"
}
```

### Caption Template

Create a `caption-template.txt` file in the root directory with your caption content:

```text
Amidst the serenity of the red flower valley, bravery stands tall. 🌺💪 
.
.
.
.
°✩₊☾₊✩°｡⋆⋆｡°✩₊☾₊✩°｡⋆⋆｡°✩₊☾₊✩°

Follow @glowtail.ai for more!  ❤

°✩₊☾₊✩°｡⋆⋆｡°✩₊☾₊✩°｡⋆⋆｡°✩₊☾₊✩°
.
.
.
Hi-Res wallpapers are available on my Kofi page ❤
.
.
.
.
.

#aiart #midjourney
```

## Running the Application

To start the application, run:

```bash
npm run start:dev
```

The application will be available at `http://localhost:4000`.

### Using PM2 for Process Management

Start the application with PM2:

```bash
pm2 start ecosystem.config.js
```

## API Endpoints

### Swagger UI

Access the Swagger UI for API documentation at: `http://localhost:4000/api`

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

### Post Image to Instagram

- **Endpoint:** `POST /instagram/postImage`
- **Description:** Posts a watermarked image to Instagram.
- **Consumes:** `multipart/form-data`
- **Request Body:**
  - `image` (file): The image file to upload and post.
  - `caption` (string): The caption for the Instagram post.
  - `tags` (string): The tags for the Instagram post.
- **Response:**
  - `200 OK`: Image posted successfully to Instagram.
  - `500 Internal Server Error`: Error posting image to Instagram.

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
- `IG_USERNAME`: Your Instagram username.
- `IG_PASSWORD`: Your Instagram password.
- `LOGO_PATH`: Path to the watermark logo file.
- `LOGO_TEXT`: Text to include in the watermark.
- `CAPTION_TEMPLATE`: Path to the caption template file.
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

### InstagramService

- **postToInstagram(imagePath: string, caption: string, tags: string): Promise<void>**
  - Posts the specified image to Instagram with the given caption.

## PM2 Setup

### Ecosystem File

Create an `ecosystem.config.js` file in the root directory:

```javascript
module.exports = {
  apps: [
    {
      name: 'instagram-service',
      script: 'dist/main.js',
      watch: true,
      ignore_watch: ['node_modules', 'src', '.env'],
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
```

### Start with PM2

Start the application with PM2:

```bash
pm2 start ecosystem.config.js
```

## Development

### Watch Mode

To run the application in watch mode for development:

```bash
npm run start:dev
```

## License

This project is licensed under the MIT License.
```

This `README.md` file now includes comprehensive instructions for setting up and using the service, including the new endpoint to handle file uploads for posting images to Instagram.