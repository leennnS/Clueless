/**
 * Entry Point: main.ts
 *
 * Bootstraps the NestJS application, configures global middleware,
 * initializes validation, CORS, and Swagger API documentation.
 *
 * Responsibilities:
 *  - Create the root NestJS application from AppModule.
 *  - Apply global validation (whitelisting DTO properties).
 *  - Enable CORS for cross-origin requests.
 *  - Set up Swagger UI for interactive API documentation.
 *  - Start the HTTP server on port 3000.
 */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  // Create the main NestJS application
  const app = await NestFactory.create(AppModule);

  /**
   * Global validation:
   * Automatically validates incoming DTOs and removes unlisted properties.
   */
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  /**
   * Enable CORS:
   * Allows frontend clients (e.g., React or JavaFX apps) to interact with this API.
   */
  app.enableCors();

  /**
   * Swagger configuration:
   * Provides an interactive API explorer at /api.
   */
  const config = new DocumentBuilder()
    .setTitle('Virtual Closet API')
    .setDescription('Interactive API documentation for the Virtual Closet backend')
    .setVersion('1.0')
    .addBearerAuth() // Optional: Enables JWT authentication in Swagger
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Start server
  await app.listen(3000);
  console.log(`🚀 Server running at: http://localhost:3000`);
  console.log(`📘 Swagger docs available at: http://localhost:3000/api`);
}

bootstrap();
