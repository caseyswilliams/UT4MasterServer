<template>
  <div class="list-friends">
    <template v-if="incoming.length">
      <h5>Incoming</h5>
      <div v-for="friend in incoming" :key="friend.accountId" class="friend">
        <div class="name">{{ friend.username }}</div>
        <button
          class="btn btn-sm btn-icon"
          title="Accept"
          @click="$emit('add', friend.accountId)"
        >
          <FontAwesomeIcon icon="fa-solid fa-check" />
        </button>
        <button
          class="btn btn-sm btn-icon"
          title="Reject"
          @click="$emit('remove', friend.accountId)"
        >
          <FontAwesomeIcon icon="fa-solid fa-trash-can" />
        </button>
      </div>
      <br />
    </template>
    <template v-if="outgoing.length">
      <h5>Outgoing</h5>
      <div v-for="friend in outgoing" :key="friend.accountId" class="friend">
        <div class="name">{{ friend.username }}</div>
        <button
          class="btn btn-sm btn-icon"
          title="Reject"
          @click="$emit('remove', friend.accountId)"
        >
          <FontAwesomeIcon icon="fa-solid fa-trash-can" />
        </button>
      </div>
    </template>
    <h5 v-if="!friends.length">No friend requests</h5>
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
import { FriendRequestDirection } from '@/enums/friend-status';
import { IFriendRequest } from '@/types/friend-request';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { PropType, computed } from 'vue';

const props = defineProps({
  friends: {
    type: Array as PropType<IFriendRequest[]>,
    default: () => []
  }
});

defineEmits(['add', 'remove']);

const incoming = computed(() =>
  props.friends.filter((f) => f.direction === FriendRequestDirection.Inbound)
);

const outgoing = computed(() =>
  props.friends.filter((f) => f.direction === FriendRequestDirection.Outbound)
);
</script>
