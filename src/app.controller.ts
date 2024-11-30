import { Controller, Get ,Request,Req} from "@nestjs/common";
import { AppService } from "./app.service";

@Controller('v1')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@Req() req:any): string {
    console.log(req.clientIp)
    return this.appService.getHello();
  }
}
