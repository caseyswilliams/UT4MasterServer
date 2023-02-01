<template>
  <div class="autocomplete-container">
    <input
      v-model="searchText"
      type="text"
      class="form-control"
      placeholder="Search..."
      @focus="handleFocus"
      @blur="handleBlur"
      @keydown="handleKeydown"
      @keyup="handleKeyup()"
    />
    <div v-show="menuOpen" class="autocomplete-menu dropdown-menu show">
      <a
        v-for="(item, index) in filteredItems"
        :key="`${item[itemKey]}-${index}`"
        href="#"
        class="autocomplete-menu-item dropdown-item"
        :class="{ active: index === activeIndex }"
        @click.stop.prevent="handleSelect(item)"
      >
        <div v-show="!$slots.item" class="autocomplete-menu-item-display">
          {{ searchKey ? item[searchKey] : item }}
        </div>
      </a>
      <div
        v-show="!filteredItems.length"
        class="autocomplete-menu-item dropdown-item no-items"
      >
        {{ noItemText }}
      </div>
    </div>
    <button
      v-if="searchText.length && status === AsyncStatus.OK"
      type="button"
      class="btn btn-primary btn-sm btn-smaller clear-button"
      @click="handleClear"
    >
      Clear
    </button>
    <div v-if="status === AsyncStatus.BUSY" class="spinner" />
  </div>
</template>

<style lang="scss" scoped>
.autocomplete-container {
  position: relative;

  .autocomplete-menu {
    width: 100%;
    max-height: 50vh;
    overflow: auto;

    .autocomplete-menu-item {
      cursor: pointer;
    }
  }

  button.clear-button {
    position: absolute;
    right: 10px;
    top: 10px;
  }

  .spinner {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translate(0, -50%);
    background-image: url(../assets/loading.gif);
    background-size: contain;
    height: 30px;
    width: 30px;
    z-index: 10;
  }
}
</style>

<script setup lang="ts">
import { ref, PropType, computed, watch } from 'vue';
import { debounce } from 'ts-debounce';
import { AsyncStatus } from '@/types/async-status';

const props = defineProps({
  items: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    type: Array as PropType<any[]>,
    default: () => []
  },
  itemKey: {
    type: String,
    required: true
  },
  searchKey: {
    type: String,
    required: true
  },
  value: {
    type: String,
    default: undefined
  },
  status: {
    type: Number as PropType<AsyncStatus>,
    default: AsyncStatus.OK
  },
  noItemText: {
    type: String,
    default: 'No results'
  }
});

const emit = defineEmits(['select', 'inputChange']);

const searchText = ref('');
const menuOpen = ref(false);
const activeIndex = ref(-1);
const initialValueSet = ref(false);

const filteredItems = computed(() =>
  props.items.filter((i) =>
    ((props.searchKey ? i[props.searchKey] : i) as string)
      ?.toLocaleLowerCase()
      .includes(searchText.value.toLocaleLowerCase())
  )
);

function handleFocus() {
  menuOpen.value = true;
}

function handleBlur(event: FocusEvent) {
  if (!event.relatedTarget) {
    menuOpen.value = false;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function handleSelect(item?: any) {
  emit('select', item);
  menuOpen.value = false;
  searchText.value = item[props.searchKey].toString();
}

function handleClear() {
  searchText.value = '';
  handleSelect();
  handleKeyup();
}

function setActiveIndex(i: number) {
  if (i < 0) {
    activeIndex.value = filteredItems.value.length - 1;
  } else if (i > filteredItems.value.length - 1) {
    activeIndex.value = 0;
  } else {
    activeIndex.value = i;
  }
}

function handleKeydown(event: KeyboardEvent) {
  menuOpen.value = true;
  if (event.key === 'ArrowDown') {
    event.preventDefault();
    setActiveIndex(activeIndex.value + 1);
  } else if (event.key === 'ArrowUp') {
    event.preventDefault();
    setActiveIndex(activeIndex.value - 1);
  } else if (event.key === 'Enter') {
    event.preventDefault();
    if (filteredItems.value.length === 1) {
      activeIndex.value = 0;
    }
    const item = filteredItems.value[activeIndex.value];
    handleSelect(item);
  }
}

const handleKeyup = debounce(
  () => emit('inputChange', searchText.value ?? ''),
  500
);

function valueChanged() {
  if (props.value) {
    const match = props.items.find((i) => i[props.itemKey] === props.value);
    if (match && !initialValueSet.value) {
      searchText.value = match[props.searchKey].toString();
      initialValueSet.value = true;
    }
  }
}

function itemsChanged() {
  if (!initialValueSet.value) {
    valueChanged();
  }
}

watch(() => props.value, valueChanged);
watch(() => props.items, itemsChanged);
</script>
