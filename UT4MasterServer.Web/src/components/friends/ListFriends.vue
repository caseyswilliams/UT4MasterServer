<template>
  <AddFriend :excluded-ids="excludedIds" @add="$emit('add', $event)" />
  <hr />
  <div class="list-friends">
    <div v-for="friend in friends" :key="friend.accountId" class="friend">
      <div class="name">{{ friend.username }}</div>
      <button
        class="btn btn-sm btn-icon"
        :title="removeButtonTitle"
        @click="$emit('remove', friend.accountId)"
      >
        <FontAwesomeIcon icon="fa-solid fa-trash-can" />
      </button>
    </div>
    <h5 v-if="!friends.length">{{ emptyText }}</h5>
  </div>
</template>

<style lang="scss" scoped>
.list-friends {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  overflow: auto;

  .friend {
    display: flex;
    justify-content: space-between;

    .name {
      flex-grow: 1;
    }

    button {
      margin-left: 0.5rem;
    }
  }
}
</style>

<script setup lang="ts">
import { IFriendRequest } from '@/types/friend-request';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { PropType } from 'vue';
import AddFriend from './AddFriend.vue';

defineProps({
  friends: {
    type: Array as PropType<IFriendRequest[]>,
    default: () => []
  },
  excludedIds: {
    type: Array as PropType<string[]>,
    default: () => []
  },
  removeButtonTitle: {
    type: String,
    default: 'Remove friend'
  },
  emptyText: {
    type: String,
    default: 'No friends to display'
  }
});

defineEmits(['add', 'remove']);
</script>
