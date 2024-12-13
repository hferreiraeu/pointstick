import { DatabaseService } from './DatabaseService';
import { PrismaClient } from '@prisma/client';

export class Container {
  private static instance: Container;
  private prisma: PrismaClient;
  private databaseService: DatabaseService;

  private constructor() {
    this.prisma = new PrismaClient();
    this.databaseService = new DatabaseService(this.prisma);
  }

  static getInstance() {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance;
  }

  getDatabaseService() {
    return this.databaseService;
  }
}