import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    const token = /^Bearer +(\S+)$/i.exec(
      request.headers.authorization ?? '',
    )?.[1];
    if (!token) throw new UnauthorizedException('Token akses diperlukan.');

    try {
      const payload = await this.jwt.verifyAsync<{ sub: number }>(token);
      if (Number.isInteger(payload.sub) && payload.sub > 0) return true;
    } catch {
      throw new UnauthorizedException(
        'Token akses tidak valid atau sudah kedaluwarsa.',
      );
    }
    throw new UnauthorizedException('Token akses tidak valid.');
  }
}
