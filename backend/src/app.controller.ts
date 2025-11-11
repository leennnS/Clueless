/**
 * Controller: AppController
 *
 * Acts as the root controller for the application.
 * Provides a simple health check or welcome endpoint, often used to verify
 * that the API is running and responsive.
 */
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * GET /
   * 
   * Returns a basic greeting or status message from the application service.
   * Commonly used for uptime monitoring or deployment checks.
   *
   * @returns {string} A static welcome or health-check message.
   */
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
