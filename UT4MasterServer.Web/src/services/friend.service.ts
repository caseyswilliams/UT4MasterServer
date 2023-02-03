import { AccountStore } from '@/stores/account-store';
import { IFriendRequest } from '@/types/friend-request';
import HttpService from './http.service';

export default class FriendService extends HttpService {
  private baseUrl = `${__BACKEND_URL}/friends/api/public`;

  async getFriends() {
    return await this.get<IFriendRequest[]>(
      `${this.baseUrl}/friends/${AccountStore.account?.id}?includePending=true`
    );
  }

  async sendFriendRequest(friendId: string) {
    return await this.post(
      `${this.baseUrl}/friends/${AccountStore.account?.id}/${friendId}`
    );
  }

  async removeFriend(friendId: string) {
    return await this.delete(
      `${this.baseUrl}/friends/${AccountStore.account?.id}/${friendId}`
    );
  }

  async getBlocklist() {
    return await this.get<string[]>(
      `${this.baseUrl}/blocklist/${AccountStore.account?.id}`
    );
  }

  async blockAccount(friendId: string) {
    return await this.post(
      `${this.baseUrl}/blocklist/${AccountStore.account?.id}/${friendId}`
    );
  }

  async unblockAccount(friendId: string) {
    return await this.delete(
      `${this.baseUrl}/blocklist/${AccountStore.account?.id}/${friendId}`
    );
  }
}
