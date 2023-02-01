<template>
  <Autocomplete
    :value="modelValue"
    :items="accounts"
    item-key="id"
    search-key="username"
    no-item-text="No matching users"
    @input-change="searchAccounts"
    @select="handleSelectAccount"
  />
</template>

<script lang="ts" setup>
import { ref, shallowRef, PropType } from 'vue';
import { IAccount } from '@/types/account';
import { AsyncStatus } from '@/types/async-status';
import AccountService from '@/services/account.service';
import { AccountStore } from '@/stores/account-store';
import Autocomplete from '@/components/Autocomplete.vue';

const props = defineProps({
  modelValue: {
    type: String,
    default: undefined
  },
  excludeSelf: {
    type: Boolean,
    default: true
  },
  alwaysIncludeSelf: {
    type: Boolean,
    default: false
  },
  excludedIds: {
    type: Array as PropType<string[]>,
    default: () => []
  }
});

const emit = defineEmits(['update:modelValue']);

const accountService = new AccountService();

const accountsStatus = shallowRef(AsyncStatus.OK);
const accountId = ref<string | undefined>(undefined);
const accounts = ref<IAccount[]>([]);

async function searchAccounts(query: string) {
  try {
    accountsStatus.value = AsyncStatus.BUSY;
    accounts.value = (await accountService.searchAccounts(query)).accounts;
    accounts.value = accounts.value.filter(
      (a) => !props.excludedIds.includes(a.id)
    );
    if (props.excludeSelf) {
      accounts.value = accounts.value.filter(
        (a) => a.id !== AccountStore.account?.id
      );
    }
    if (AccountStore.account && props.alwaysIncludeSelf) {
      accounts.value.unshift(AccountStore.account);
    }
    accountId.value = AccountStore.account?.id;
    accountsStatus.value = AsyncStatus.OK;
  } catch (err: unknown) {
    accountsStatus.value = AsyncStatus.ERROR;
    console.error(err);
  }
}

function handleSelectAccount(account?: IAccount) {
  accountId.value = account?.id;
  emit('update:modelValue', accountId.value);
}
</script>
