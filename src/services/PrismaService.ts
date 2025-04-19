import { PrismaClient } from '@prisma/client';

export class PrismaService {
  private static instance: PrismaService;
  private prisma: PrismaClient;

  private constructor() {
    this.prisma = new PrismaClient();
  }

  static getInstance(): PrismaService {
    if (!PrismaService.instance) {
      PrismaService.instance = new PrismaService();
    }
    return PrismaService.instance;
  }

  /** Access to the raw Prisma client */
  get client(): PrismaClient {
    return this.prisma;
  }
}
