import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class UserResponseDto {
  @ApiProperty({ description: 'ID do usuário' })
  id: string;

  @ApiProperty({ description: 'Nome do usuário' })
  name: string;

  @ApiProperty({ description: 'Email do usuário' })
  email: string;

  @ApiProperty({ description: 'Role do usuário', enum: Role })
  role: Role;
}

export class AuthResponseDto {
  @ApiProperty({ description: 'Token JWT de acesso' })
  accessToken: string;

  @ApiProperty({ description: 'Dados do usuário', type: UserResponseDto })
  user: UserResponseDto;
}

export class ProfileResponseDto extends UserResponseDto {
  @ApiProperty({ description: 'Data de criação' })
  createdAt: Date;

  @ApiProperty({ description: 'Data de atualização' })
  updatedAt: Date;
}

