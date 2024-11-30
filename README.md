## 全局配置yml

### 1.安装依赖  
```bash
pnpm i @nestjs/config js-yaml cross-env -S
```
### 2.package.json中加入NODE_ENV
> https://juejin.cn/post/7070347341282148365
```json
"start:dev":"cross-env NODE_ENV=development nest start --watch",
"start:prod": "cross-env NODE_ENV=production node dist/main",
```
### 3.nest-cli.json

```json
"compilerOptions": {
  "assets": [
  "**/*.yml"
  ],
  "watchAssets": true,
  "deleteOutDir": true
}
```
### 4.创建 
> src/config/index.ts  
> src/config/dev.yml  
> src/config/prod.yml
```ts
import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';

const configFileNameObj = {
    development: 'dev',
    test: 'test',
    production: 'prod',
};

const env = process.env.NODE_ENV;

console.log(env);

export default () => {
    return yaml.load(readFileSync(join(__dirname, `./${configFileNameObj[env]}.yml`), 'utf8')) as Record<string, any>;
};
```

### 4.使用配置  app.module.ts
```ts
import { ConfigModule } from '@nestjs/config';
import configuration from './config/index';
// 配置模块
@Module({
    imports: [UserModule,
        ConfigModule.forRoot({
            cache: true,
            load: [configuration],
            isGlobal: true,
        }),],
    controllers: [AppController],
    providers: [AppService],
})
```
### 5.读取配置  main.ts
```ts
import { ConfigService } from '@nestjs/config';
const config = app.get(ConfigService);
```

## swagger接口文档配置
```bash
pnpm i @nestjs/swagger -S
```
### 1.配置main.ts
```ts
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
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
```
## Api多版本控制
```ts
import { VersioningType } from "@nestjs/common";
//URI: 0, URI 版本
//   HEADER: 1, 标头版本
//   MEDIA_TYPE: 2,媒体类型
//   CUSTOM: 3 自定义版本
  app.enableVersioning({
    type: VersioningType.URI,
  });
//Controller('v1') or {version: "1",}  
```
## 集成健康检查
```bash
pnpm i @nestjs/terminus -S
@Module({
  imports: [
    TerminusModule
  ],
})
```
## 获取真是ip
```bash
pnpm i request-ip @types/request-ip -S  
```
```ts
import { mw as requestIpMw } from 'request-ip';
app.use(requestIpMw({ attributeName: 'clientIp' }));
//Controller req.clientIp
```

## 安全防护
```bash
 pnpm i helmet -S
```
```ts
import helmet from 'helmet';
//web 安全，防常见漏洞 注意： 开发环境如果开启 nest static module 需要将 crossOriginResourcePolicy 设置为 false 否则 静态资源 跨域不可访问
app.use(helmet({ crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' }, crossOriginResourcePolicy: false }));
```

## 限流
```bash
 pnpm i express-rate-limit -S
```
```ts
import rateLimit from 'express-rate-limit';
// 设置访问频率
app.use(
    rateLimit({
        windowMs: 15 * 60 * 1000, // 15分钟
        max: 1000, // 限制15分钟内最多只能访问1000次
    }),
);
```