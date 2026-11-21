import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CredentialsDto } from './credentials.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async register({ email, password }: CredentialsDto) {
    this.validatePasswordBytes(password);
    const passwordHash = await bcrypt.hash(password, 12);
    try {
      return await this.prisma.user.create({
        data: { email, passwordHash },
        select: { id: true, email: true },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Email sudah terdaftar.');
      }
      throw error;
    }
  }

  async login({ email, password }: CredentialsDto) {
    this.validatePasswordBytes(password);
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new UnauthorizedException('Email atau kata sandi salah.');
    }
    const accessToken = await this.jwt.signAsync({ sub: user.id });
    return { accessToken };
  }

  private validatePasswordBytes(password: string) {
    if (Buffer.byteLength(password, 'utf8') > 72) {
      throw new BadRequestException('Kata sandi maksimal 72 byte.');
    }
  }
}
