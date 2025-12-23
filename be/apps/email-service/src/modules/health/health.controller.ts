import {Controller, Get, Logger} from "@nestjs/common";

@Controller('health')
export class HealthController {
  @Get()
  ping() {
    Logger.log('Health Controller ping');
    return "ping!"
  }
}
