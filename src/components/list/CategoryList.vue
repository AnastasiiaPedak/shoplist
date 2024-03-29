<script setup>
import { computed } from 'vue';
import { useListStore } from '../../store/listStore';
import { useCommonStore } from '../../store/сommon';
import { useToggle } from '@vueuse/core';
import { PlusCircleIcon, XMarkIcon } from '@heroicons/vue/24/solid';
import { ExclamationCircleIcon } from '@heroicons/vue/24/outline';
import CheckboxForm from '../common/CheckboxForm.vue';
import CategoryHeaderForm from './CategoryHeaderForm.vue';
import NewItemForm from './NewItemForm.vue';
import CategoryWrapper from './CategoryWrapper.vue';

const props = defineProps({
  category: {
    type: Object,
  },
  dataToShow: {
    type: Array,
  },
});

const sortedItems = computed(() => {
  const data = [...props.dataToShow];

  const sortedData = data.sort((a, b) => {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  });

  const itemsInCart = sortedData.filter((i) => i.in_cart);

  const itemsNotInCart = sortedData.filter((i) => !i.in_cart);

  return itemsNotInCart.concat(itemsInCart);
});

const [isAddItemMode, toggleAddItemMode] = useToggle();
const commonStore = useCommonStore();
const listStore = useListStore();
const inShop = computed(() => listStore.isInShopView);

function handleCheckboxUpdate(updateData) {
  listStore.updateStatus(updateData);
}

function openNewItemForm() {
  toggleAddItemMode();
  commonStore.setActiveFormId('new_item');
  commonStore.toggleBlurredScreen();
}
</script>

<template>
  <CategoryWrapper
    class="border-2 rounded border-[#F5F5F5]/50 shadow-md shadow-[#F5F5F5]/50 mt-4 p-2"
  >
    <CategoryHeaderForm :input-props="category" />
    <TransitionGroup name="list" tag="ul">
      <li
        v-if="!sortedItems.length"
        key="no_items"
        class="text-gray-400 text-sm mt-4"
      >
        No items in the list
      </li>
      <li
        v-for="item in sortedItems"
        v-else
        :key="item.id"
        class="flex items-start flex-wrap justify-between p-2 rounded-md mt-2 bg-main-gray"
      >
        <div class="pt-[0.65rem] max-w-[47%]">
          <label
            class="font-light text-[#F5F5F5] cursor-pointer select-none"
            :class="{ 'line-through text-[#7A7777]': item.in_cart }"
          >
            {{ item.name }}
          </label>
          <p
            class="text-gray-400 text-sm overflow-hidden text-ellipsis"
            :class="{ 'text-[#7D7878] line-through': item.in_cart }"
          >
            {{ item.details }}
          </p>
        </div>
        <div
          class="flex w-[53%]"
          :class="[inShop ? 'justify-end' : 'justify-between']"
        >
          <CheckboxForm
            v-if="!inShop"
            :id="item.id"
            :model-value="item.in_default"
            name="in_default"
            @update:model-value="handleCheckboxUpdate"
          />
          <CheckboxForm
            v-if="!inShop"
            :id="item.id"
            :model-value="item.to_buy"
            name="to_buy"
            @update:model-value="handleCheckboxUpdate"
          />
          <CheckboxForm
            v-if="inShop"
            :id="item.id"
            :model-value="item.in_cart"
            name="in_cart"
            @update:model-value="handleCheckboxUpdate"
          />
          <button
            :class="{ hidden: inShop }"
            class="disabled:text-gray-400 text-error hover:text-[#c65a5a]"
            :disabled="item.in_cart"
            @click="listStore.deleteItem(item.id)"
          >
            <XMarkIcon class="w-5 h-5" />
          </button>
        </div>
        <div
          v-if="item.in_cart && !item.to_buy && !inShop"
          class="w-full text-error flex items-center"
        >
          <ExclamationCircleIcon class="w-5 h-5 mr-1.5" />
          <span>This item is in cart already.</span>
        </div>
      </li>

      <li
        v-if="isAddItemMode"
        class="p-2 rounded-md mt-2 bg-main-gray"
        :class="{
          'relative z-50':
            commonStore.isBlurredScreen &&
            commonStore.activeFormId === 'new_item',
        }"
      >
        <NewItemForm
          :category-data="category"
          @cancal-add-mode="toggleAddItemMode()"
        />
      </li>
      <li v-if="!inShop" class="flex items-center mt-2">
        <button type="button" @click="openNewItemForm">
          <PlusCircleIcon class="w-7 h-7 text-main-green" />
        </button>
      </li>
    </TransitionGroup>
  </CategoryWrapper>
</template>

<style scoped>
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
.list-leave-active {
  position: absolute;
}
</style>
