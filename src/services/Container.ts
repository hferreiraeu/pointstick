import { ServerService } from './ServerService';
import { LeaderboardService } from './LeaderboardService';
import { MemberService } from './MemberService';
import { PointHistoryService } from './PointHistoryService';
import { AdminPermissionService } from './AdminPermissionService';

export class Container {
  private static instance: Container;

  serverService: ServerService;
  leaderboardService: LeaderboardService;
  memberService: MemberService;
  pointHistoryService: PointHistoryService;
  adminPermissionService: AdminPermissionService;

  private constructor() {
    this.serverService = new ServerService();
    this.leaderboardService = new LeaderboardService();
    this.memberService = new MemberService();
    this.pointHistoryService = new PointHistoryService();
    this.adminPermissionService = new AdminPermissionService();
  }

  static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance;
  }
}
