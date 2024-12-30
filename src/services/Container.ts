import { DatabaseService } from './DatabaseService';
import { ServerService } from './ServerService';
import { LeaderboardService } from './LeaderboardService';
import { MemberService } from './MemberService';
import { PointHistoryService } from './PointHistoryService';
import { AdminPermissionService } from './AdminPermissionService';

export class Container {
  private static instance: Container;
  private dbService: DatabaseService;

  serverService: ServerService;
  leaderboardService: LeaderboardService;
  memberService: MemberService;
  pointHistoryService: PointHistoryService;
  adminPermissionService: AdminPermissionService;

  private constructor() {
    this.dbService = new DatabaseService();
    const prisma = this.dbService.getPrismaClient();

    this.serverService = new ServerService(prisma);
    this.leaderboardService = new LeaderboardService(prisma);
    this.memberService = new MemberService(prisma);
    this.pointHistoryService = new PointHistoryService(prisma);
    this.adminPermissionService = new AdminPermissionService(prisma);
  }

  static getInstance() {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance;
  }
}
