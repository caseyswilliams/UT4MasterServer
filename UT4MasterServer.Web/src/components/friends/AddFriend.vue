<template>
  <div class="add-friend">
    <AccountSearch
      v-model="accountId"
      :excluded-ids="excludedIds"
      exclude-self
    />
    <button
      type="button"
      class="btn btn-icon btn-lg"
      :disabled="!accountId"
      @click="add"
    >
      <FontAwesomeIcon :icon="icon" />
    </button>
  </div>
</template>

<style lang="scss" scoped>
.add-friend {
  width: 100%;
  display: flex;
  div {
    flex-grow: 1;
  }
  button {
    padding: 0.5rem 1rem;
  }
}
</style>

<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { shallowRef, PropType } from 'vue';
import AccountSearch from '../AccountSearch.vue';

defineProps({
  icon: {
    type: String,
    default: 'fa-solid fa-plus'
  },
  title: {
    type: String,
    default: 'Send Friend Request'
  },
  excludedIds: {
    type: Array as PropType<string[]>,
    default: () => []
  }
});

const emit = defineEmits(['add']);

const accountId = shallowRef<string | undefined>(undefined);

function add() {
  if (!accountId.value) {
    return;
  }
  emit('add', accountId.value);
  accountId.value = undefined;
}
</script>
