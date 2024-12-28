import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule ,ConfigService} from '@nestjs/config';
import { TypeOrmModule ,TypeOrmModuleOptions } from '@nestjs/typeorm';
import configuration from './config/index';

@Module({
  imports: [UserModule,
    // 配置模块
    ConfigModule.forRoot({
      cache: true,
      load: [configuration],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports:[ConfigModule],
      inject:[ConfigService],
      useFactory:(config:ConfigService)=>{
        return {
          type: 'mysql',
          ...config.get('db.mysql'),
        }  as TypeOrmModuleOptions
      }
    }),
    TerminusModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
