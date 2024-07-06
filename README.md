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
  - [Post Images to Instagram as Album](#post-images-to-instagram-as-album)
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
- Post multiple images to Instagram as an album.
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

### Post Images to Instagram as Album

- **Endpoint:** `POST /instagram/postImages`
- **Description:** Posts multiple watermarked images to Instagram as an album.
- **Consumes:** `multipart/form-data`
- **Request Body:**
  - `images` (array of files): The image files to upload and post.
  - `caption` (string): The caption for the Instagram post.
  - `tags` (string): The tags for the Instagram post.
- **Response:**
  - `200 OK`: Images posted successfully to Instagram.
  - `500 Internal Server Error`: Error posting images to Instagram.

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

  @ApiProperty({ description: 'Text to include in the