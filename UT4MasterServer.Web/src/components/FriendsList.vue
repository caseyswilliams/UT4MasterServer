<template>
  <div class="friends">
    <button
      class="btn btn-icon btn-lg friends-button"
      :class="{ 'text-light bg-dark': showFriendsList }"
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
        <li class="nav-item" :class="{ active: selectedTab === 'list' }">
          <a class="nav-link" @click="selectTab('list')">Friends</a>
        </li>
        <li class="nav-item" :class="{ active: selectedTab === 'pending' }">
          <a class="nav-link" @click="selectTab('pending')">Pending</a>
        </li>
        <li class="nav-item" :class="{ active: selectedTab === 'add' }">
          <a class="nav-link" @click="selectTab('add')">Add</a>
        </li>
      </ul>
      <div class="tab-content">
        <div
          class="tab-pane fade"
          :class="{ 'show active': selectedTab === 'list' }"
        >
          <p>List</p>
        </div>
        <div
          class="tab-pane fade"
          :class="{ 'show active': selectedTab === 'pending' }"
        >
          <p>Pending</p>
        </div>
        <div
          class="tab-pane fade"
          :class="{ 'show active': selectedTab === 'add' }"
        >
          <AddFriend />
        </div>
      </div>
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
    min-width: 400px;
    height: 50vh;
    z-index: 10;

    .nav-item {
      margin-right: 0;
    }

    .tab-content {
      padding-top: 1rem;
    }
  }
}
</style>

<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { shallowRef } from 'vue';
import AddFriend from './AddFriend.vue';

const showFriendsList = shallowRef(false);
const selectedTab = shallowRef('list');

function selectTab(tab: string) {
  selectedTab.value = tab;
}
</script>
