Here's a `README.md` file for your NestJS application with the Instagram and watermark services. This documentation covers setup, configuration, and usage.

```markdown
# Instagram Posting Service with Watermark

This NestJS application provides a service to watermark images and post them to Instagram. The service can handle image watermarking with a custom logo and text, and then publish the watermarked image to Instagram.

## Features

- Watermark images with a custom logo and text.
- Post images to Instagram.
- Read captions from a template file.
- Swagger UI for API documentation.
- PM2 configuration for process management.

## Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [PM2 Setup](#pm2-setup)
- [Development](#development)
- [License](#license)

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
PORT=4000
IG_USERNAME=your_instagram_username
IG_PASSWORD=your_instagram_password
LOGO_PATH=path_to_logo_file
LOGO_TEXT=YourLogoText
CAPTION_TEMPLATE=caption-template.txt
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
this is a caption. 🌺💪 
.
.
.
.
.
.
.
.
.
.
.
.
#caption #instagram
```

## Usage

### Running the Application

Start the application in development mode:

```bash
npm run start:dev
```

### Using PM2 for Process Management

Start the application with PM2:

```bash
pm2 start ecosystem.config.js
```

## API Endpoints

### Swagger UI

Access the Swagger UI for API documentation at: `http://localhost:4000/api`

### Instagram Endpoints

#### Post Image to Instagram

- **URL**: `/instagram/postImage`
- **Method**: `POST`
- **Body**:
    ```json
    {
      "imageUrl": "https://example.com/image.jpg"
    }
    ```
- **Response**: `200 OK` with message `Image posted successfully to Instagram!`

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

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
```

Make sure to replace `<repository_url>` and `<repository_directory>` with the appropriate values for your project. This README covers installation, configuration, usage, API endpoints, PM2 setup, and development.