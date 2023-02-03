<template>
  <div v-if="AccountStore.account?.id" class="friends">
    <button
      class="btn btn-icon btn-lg friends-button"
      :class="{ 'bg-medium': showFriendsList }"
      title="Friends"
      @click="showFriendsList = !showFriendsList"
    >
      <FontAwesomeIcon icon="fa-solid fa-user-group" />
    </button>
    <div
      v-show="showFriendsList"
      class="alert alert-dismissible alert-primary friends-list"
    >
      <button
        type="button"
        class="btn-close"
        @click="showFriendsList = false"
      ></button>
      <ul class="nav nav-tabs" role="tablist">
        <li class="nav-item" :class="{ active: selectedTab === 'friends' }">
          <a class="nav-link" @click="selectTab('friends')">Friends</a>
        </li>
        <li class="nav-item" :class="{ active: selectedTab === 'pending' }">
          <a class="nav-link" @click="selectTab('pending')">Pending</a>
        </li>
        <li class="nav-item" :class="{ active: selectedTab === 'blocked' }">
          <a class="nav-link" @click="selectTab('blocked')">Blocked</a>
        </li>
      </ul>
      <div class="content">
        <LoadingPanel :status="status" auto-load @load="loadData">
          <div class="tab-content">
            <div
              class="tab-pane fade"
              :class="{ 'show active': selectedTab === 'friends' }"
            >
              <ListFriends
                :friends="friends"
                :excluded-ids="allAccountIds"
                @add="addFriend"
                @remove="removeFriend"
              />
            </div>
            <div
              class="tab-pane fade"
              :class="{ 'show active': selectedTab === 'pending' }"
            >
              <ListPending
                :friends="pending"
                @add="addFriend"
                @remove="removeFriend"
              />
            </div>
            <div
              class="tab-pane fade"
              :class="{ 'show active': selectedTab === 'blocked' }"
            >
              <ListBlocked
                :friends="blockedAccounts"
                :excluded-ids="allAccountIds"
                @add="blockAccount"
                @remove="unblockAccount"
              />
            </div>
          </div>
        </LoadingPanel>
      </div>
      <div class="fs-6">Chat coming soon</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.friends {
  position: relative;

  button.btn-lg {
    padding-left: 0.5rem;
    span {
      text-transform: none;
      font-size: 0.75rem;
      padding-left: 0.5rem;
    }

    &.bg-medium {
      background-color: #d1d1d1;
    }
  }

  .friends-button {
    padding: 0.5rem;
    margin: -0.5rem -0.5rem -0.5rem 0.5rem;
  }

  .friends-list {
    position: absolute;
    top: 32px;
    left: 8px;
    width: 20vw;
    min-width: 360px;
    height: 50vh;
    z-index: 10;
    display: flex;
    flex-direction: column;

    .content {
      flex-grow: 1;
    }

    .nav-item {
      margin-right: 0;
      cursor: pointer;
      &.active {
        .nav-link {
          isolation: isolate;
          border-color: var(--bs-nav-tabs-link-hover-border-color);
        }
      }
    }

    .tab-content {
      padding-top: 1rem;
    }
  }
}
</style>

<script setup lang="ts">
import { FriendStatus } from '@/enums/friend-status';
import AccountService from '@/services/account.service';
import FriendService from '@/services/friend.service';
import { AccountStore } from '@/stores/account-store';
import { AsyncStatus } from '@/types/async-status';
import { IFriendRequest } from '@/types/friend-request';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { shallowRef } from 'vue';
import LoadingPanel from '../LoadingPanel.vue';
import ListBlocked from './ListBlocked.vue';
import ListFriends from './ListFriends.vue';
import ListPending from './ListPending.vue';

const friendService = new FriendService();
const accountService = new AccountService();

const showFriendsList = shallowRef(false);
const selectedTab = shallowRef('friends');
const status = shallowRef(AsyncStatus.OK);
const allAccountIds = shallowRef<string[]>([]);
const friends = shallowRef<IFriendRequest[]>([]);
const pending = shallowRef<IFriendRequest[]>([]);
const blockedAccounts = shallowRef<IFriendRequest[]>([]);

function selectTab(tab: string) {
  selectedTab.value = tab;
}

async function loadData() {
  try {
    status.value = AsyncStatus.BUSY;
    const [friendsResponse, blocklistResponse] = await Promise.all([
      friendService.getFriends(),
      friendService.getBlocklist()
    ]);
    const friendIds = friendsResponse.map((f) => f.accountId);
    const blockedIds = blocklistResponse;
    allAccountIds.value = [...friendIds, ...blockedIds].filter((i) => !!i);
    const accounts = await accountService.getAccountsByIds(allAccountIds.value);
    const mappedFriends = friendsResponse.map((f) => ({
      ...f,
      username: accounts.find((a) => a.id === f.accountId)?.username
    }));
    friends.value = mappedFriends.filter(
      (f) => f.status === FriendStatus.Accepted
    );
    pending.value = mappedFriends.filter(
      (f) => f.status === FriendStatus.Pending
    );
    blockedAccounts.value = blockedIds.map((b) => ({
      accountId: b,
      status: FriendStatus.Blocked,
      username: accounts.find((a) => a.id === b)?.username
    }));
    status.value = AsyncStatus.OK;
  } catch (err: unknown) {
    status.value = AsyncStatus.ERROR;
    console.error(err);
  }
}

async function addFriend(id: string) {
  try {
    status.value = AsyncStatus.BUSY;
    await friendService.sendFriendRequest(id);
    loadData();
  } catch (err: unknown) {
    status.value = AsyncStatus.ERROR;
    console.error(err);
  }
}

async function removeFriend(id: string) {
  try {
    status.value = AsyncStatus.BUSY;
    await friendService.removeFriend(id);
    loadData();
    status.value = AsyncStatus.OK;
  } catch (err: unknown) {
    status.value = AsyncStatus.ERROR;
    console.error(err);
  }
}

async function blockAccount(id: string) {
  try {
    console.debug('block', id);
    status.value = AsyncStatus.BUSY;
    await friendService.blockAccount(id);
    loadData();
  } catch (err: unknown) {
    status.value = AsyncStatus.ERROR;
    console.error(err);
  }
}

async function unblockAccount(id: string) {
  try {
    status.value = AsyncStatus.BUSY;
    await friendService.unblockAccount(id);
    loadData();
  } catch (err: unknown) {
    status.value = AsyncStatus.ERROR;
    console.error(err);
  }
}
</script>
