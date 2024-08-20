import { NestFactory } from "@nestjs/core";
import { VersioningType } from "@nestjs/common";
import { NestExpressApplication } from "@nestjs/platform-express";
import { AppModule } from "./app.module";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // 设置swagger文档
  const config = new DocumentBuilder()
    .setTitle("管理后台")
    .setDescription("管理后台接口文档")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document);
  //全局\局部版本控制   全局需结合Controller{  path: "",version: "1",}
  // app.enableVersioning({
  //   type: VersioningType.URI,
  //   // header: "version",
  // });
  //全局路由前缀
  app.setGlobalPrefix("api");
  await app.listen(3001);
}
bootstrap();
