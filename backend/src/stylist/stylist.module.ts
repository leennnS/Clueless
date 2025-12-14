import { Module } from '@nestjs/common';
import { StylistService } from './stylist.service';
import { StylistResolver } from './stylist.resolver';
import { ClothingItemModule } from '../clothing-item/clothing-item.module';
import { UserModule } from '../user/user.module';
import { WeatherModule } from '../weather/weather.module';
import { OpenAiClientService } from './openai-client.service';

@Module({
  imports: [UserModule, ClothingItemModule, WeatherModule],
  providers: [StylistService, StylistResolver, OpenAiClientService],
  exports: [StylistService],
})
export class StylistModule {}
