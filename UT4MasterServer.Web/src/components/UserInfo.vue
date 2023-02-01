<template>
  <div class="navbar navbar-primary bg-light user-info">
    <div class="container">
      <div class="d-flex align-items-center">
        <label> Username: </label>
        <RouterLink to="/Profile/PlayerCard">{{
          AccountStore.account?.username
        }}</RouterLink>
        <button
          class="btn btn-icon btn-lg"
          :class="{ 'text-success': copied }"
          title="Get auth code and copy to clipboard"
          @click="getAuthCode"
        >
          <FontAwesomeIcon v-if="!copied" icon="fa-solid fa-key" />
          <FontAwesomeIcon v-else icon="fa-solid fa-check" />
          <span>{{ copied ? 'Copied to clipboard!' : '' }}</span>
        </button>
      </div>
      <div v-if="false">
        <button
          class="btn btn-icon btn-lg friends-button"
          :class="{ 'text-light bg-dark': showFriendsList }"
          @click="showFriendsList = !showFriendsList"
          title="Friends"
        >
          <FontAwesomeIcon icon="fa-solid fa-user-group" />
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.user-info {
  padding: 10px 0;
  text-transform: none;
  font-size: 0.8rem;

  label {
    text-transform: uppercase;
    font-size: 0.6rem;
    margin-right: 5px;
  }

  a {
    text-decoration: none;
  }

  button.btn-lg {
    padding-left: 0.5rem;
    span {
      text-transform: none;
      font-size: 0.75rem;
      padding-left: 0.5rem;
    }
  }

  .friends-button {
    padding: 0.5rem;
    margin: -0.5rem -0.5rem -0.5rem 0.5rem;
  }
}
</style>

<script setup lang="ts">
import { shallowRef, onMounted } from 'vue';
import AuthenticationService from '@/services/authentication.service';
import { AsyncStatus } from '@/types/async-status';
import { AccountStore } from '@/stores/account-store';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const service = new AuthenticationService();
const status = shallowRef(AsyncStatus.OK);
const copied = shallowRef(false);
const showFriendsList = shallowRef(false);

async function getAuthCode() {
  try {
    status.value = AsyncStatus.BUSY;
    const authCode = await service.getAuthCode();
    status.value = authCode !== null ? AsyncStatus.OK : AsyncStatus.ERROR;
    if (authCode) {
      navigator.clipboard.writeText(authCode);
      copied.value = true;
      setTimeout(() => (copied.value = false), 2000);
    }
  } catch (err: unknown) {
    status.value = AsyncStatus.ERROR;
  }
}

onMounted(() => {
  if (AccountStore.account === null) {
    AccountStore.fetchUserAccount();
  }
});
</script>
