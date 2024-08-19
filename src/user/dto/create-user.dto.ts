import { ApiProperty,ApiPropertyOptional } from '@nestjs/swagger';
export class CreateUserDto {
@ApiProperty({ description: '名称' })
  readonly name: string;

@ApiProperty({ description: '密码' })
  readonly password: string;
}
