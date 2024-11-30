
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { ConfigService } from '@nestjs/config';
import { AppModule } from "./app.module";
import { VersioningType } from "@nestjs/common";
import { mw as requestIpMw } from 'request-ip';
//限流
import rateLimit from 'express-rate-limit';
//安全防护
import helmet from 'helmet';

import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule,{
    cors:true// 开启跨域访问
  });
  //读取config dev.yml配置
  const configService = app.get(ConfigService);
  // 设置全局访问api前缀
  const prefix = configService.get<string>('app.prefix');
  app.setGlobalPrefix(prefix);

  // 设置访问频率
  app.use(
      rateLimit({
        windowMs: 15 * 60 * 1000, // 15分钟
        max: 1000, // 限制15分钟内最多只能访问1000次
      }),
  );

  //web 安全，防常见漏洞 注意： 开发环境如果开启 nest static module 需要将 crossOriginResourcePolicy 设置为 false 否则 静态资源 跨域不可访问
  app.use(helmet({ crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' }, crossOriginResourcePolicy: false }));

  // swagger接口文档
   const swaggerOptions = new DocumentBuilder()
       .setTitle("Nest Admin")
       .setDescription("后台管理接口文档")
       .setVersion("1.0")
        .addBearerAuth()
        .build();
  const document = SwaggerModule.createDocument(app, swaggerOptions);
  // 生产环境使用 nginx 可以将当前文档地址 屏蔽外部访问
  SwaggerModule.setup(`${prefix}/swagger-ui`, app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: 'Nest-Admin API Docs',
  });
  // API 多版本控制
  app.enableVersioning({
    type: VersioningType.URI,
  });

  // 获取真实 ip
  app.use(requestIpMw({ attributeName: 'clientIp' }));

  //服务端口
  const port = configService.get<number>('app.port') || 8080;
  await app.listen(3001);

  console.log('服务地址', `http://localhost:${port}${prefix}/`, '\n','swagger接口文档地址 ', `http://localhost:${port}${prefix}/swagger-ui/`);
}
bootstrap();
