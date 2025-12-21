import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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

  @ApiProperty({ description: 'Status ativo do usuário' })
  isActive: boolean;

  @ApiProperty({ description: 'Data de criação' })
  createdAt: Date;

  @ApiProperty({ description: 'Data de atualização' })
  updatedAt: Date;
}

export class UserListResponseDto {
  @ApiProperty({ description: 'Lista de usuários', type: [UserResponseDto] })
  data: UserResponseDto[];

  @ApiProperty({ description: 'Total de usuários' })
  total: number;

  @ApiPropertyOptional({ description: 'Página atual' })
  page?: number;

  @ApiPropertyOptional({ description: 'Itens por página' })
  limit?: number;
}

