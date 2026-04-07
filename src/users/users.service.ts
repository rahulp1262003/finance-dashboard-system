import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateRoleDto } from './dto/update-user.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService, private jwtService: JwtService) { }

  private readonly userSelect = {
    id: true,
    name: true,
    email: true,
    role: true,
    isActive: true,
    createdAt: true,
    updatedAt: true,
  };

  async findAll() {
    return this.prismaService.user.findMany({
      select: this.userSelect,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
      select: this.userSelect,
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return user;
  }

  async updateRole(id: string, updateRoleDto: UpdateRoleDto) {
    await this.findOne(id); // throws 404 if not found

    // Update role in DB
    const updatedUser = await this.prismaService.user.update({
      where: { id },
      data: { role: updateRoleDto.role },
      select: this.userSelect,
    });

    // Reissue token with updated role
    const payload = { sub: updatedUser.id, role: updatedUser.role };
    const newToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET_KEY,
      expiresIn: '1h',
    });

    return {
      ...updatedUser,
      accessToken: newToken,  // return new token to admin
    };
  }

  async updateStatus(id: string, updateStatusDto: UpdateStatusDto) {
    await this.findOne(id); // throws 404 if not found

    return this.prismaService.user.update({
      where: { id },
      data: { isActive: updateStatusDto.isActive },
      select: this.userSelect,
    });
  }
}