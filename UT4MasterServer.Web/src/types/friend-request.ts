import { FriendRequestDirection, FriendStatus } from '@/enums/friend-status';

export interface IFriendRequest {
  accountId: string;
  status: FriendStatus;
  direction?: FriendRequestDirection;
  created?: string;
  favourite?: boolean;
  username?: string;
}
