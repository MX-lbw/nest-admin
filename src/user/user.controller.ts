import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  Query,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('用户管理')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @ApiOperation({ summary: '创建用户' })
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
  @ApiOperation({ summary: '查询所有用户' })
  @Get()
  @HttpCode(200)
  findAll() {
    return this.userService.findAll();
  }
  @ApiOperation({ summary: '查询用户' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }
  @ApiOperation({ summary: '修改用户' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }
  @ApiOperation({ summary: '删除用户' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
