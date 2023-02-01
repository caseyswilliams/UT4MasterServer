<template>
  <div class="add-friend">
    <AccountSearch v-model="accountId" exclude-self />
    <button type="button" class="btn btn-icon btn-lg" @click="add">
      <FontAwesomeIcon icon="fa-solid fa-plus" />
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
import { shallowRef } from 'vue';
import AccountSearch from './AccountSearch.vue';

const emit = defineEmits(['added']);

const accountId = shallowRef<string | undefined>(undefined);

function add() {
  console.debug('add', accountId.value);
  emit('added');
}
</script>
