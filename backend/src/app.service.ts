/**
 * Service: AppService
 *
 * Provides basic application-level logic and responses.
 * Currently acts as a placeholder service for root API routes
 * (e.g., for health checks or deployment testing).
 */
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  /**
   * Returns a simple greeting or API health confirmation message.
   *
   * @returns {string} A static text response confirming the server is running.
   */
  getHello(): string {
    return 'Hello World!';
  }
}
