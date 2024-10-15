import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UrlService implements OnModuleInit {
  private urlStore = new Map<string, string>(); // Armazenar URLs em memória

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    const urls = await this.prisma.url.findMany(); // Carregar URLs do banco de dados
    urls.forEach((url) => {
      this.urlStore.set(url.shortCode, url.longUrl);
    });
  }

  async shortenUrl(longUrl: string): Promise<string> {
    const shortCode = uuidv4().slice(0, 6);
    this.urlStore.set(shortCode, longUrl);

    await this.prisma.url.create({
      data: {
        shortCode,
        longUrl,
      },
    });

    return shortCode;
  }

  async getLongUrl(shortCode: string): Promise<string> {
    return this.urlStore.get(shortCode);
  }
}
