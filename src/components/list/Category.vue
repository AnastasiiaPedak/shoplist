<script setup>
import { computed } from 'vue';
import { useListStore } from '../../store/listStore';
import { useCommonStore } from '../../store/сommon';
import { useToggle } from '@vueuse/core';
import { PlusCircleIcon, XMarkIcon } from '@heroicons/vue/24/solid';
import { ExclamationCircleIcon } from '@heroicons/vue/24/outline';
import Checkbox from '../common/Checkbox.vue';
import CategoryHeaderForm from './CategoryHeaderForm.vue';
import NewItemForm from './NewItemForm.vue';
import CategoryWrapper from './CategoryWrapper.vue';

const props = defineProps(['category', 'dataToShow']);

const sortedItems = computed(() => {
  return props.dataToShow.sort((a,b) => a.in_cart - b.in_cart);
})

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
  <CategoryWrapper class="border-2 rounded border-[#F5F5F5]/50 shadow-md shadow-[#F5F5F5]/50 mt-4 p-2">
    <CategoryHeaderForm :inputProps="category" />
    <ul>
      <li v-if="!sortedItems.length" class="text-gray-400 text-sm mt-4">
        No items in the list
      </li>
      <li
        v-else 
        v-for="item in sortedItems" 
        :key="item.id" 
        class="flex items-start flex-wrap justify-between p-2 rounded-md mt-2 bg-main-gray"
      >
        <div class="pt-[0.65rem] max-w-[47%]">
          <label class="font-light text-[#F5F5F5] cursor-pointer select-none" :class="{'line-through text-[#7A7777]': item.in_cart}">
            {{ item.name }}
          </label>
          <p class="text-gray-400 text-sm overflow-hidden text-ellipsis" :class="{'text-[#7D7878] line-through': item.in_cart}">
            {{ item.details }}
          </p>
        </div>
        <div class="flex w-[53%]" :class="[inShop ? 'justify-end' : 'justify-between']">
          <Checkbox 
            v-if="!inShop" 
            :model-value="item.in_default" 
            :id="item.id"
            name="in_default"
            @update:model-value="handleCheckboxUpdate"
          />
          <Checkbox 
            v-if="!inShop" 
            :model-value="item.to_buy" 
            :id="item.id"
            name="to_buy" 
            @update:model-value="handleCheckboxUpdate"
          />
          <Checkbox 
            v-if="inShop" 
            :id="item.id" 
            :model-value="item.in_cart" 
            name="in_cart"
            @update:model-value="handleCheckboxUpdate"
          />
          <button 
            :class="{ 'hidden': inShop}" 
            class="disabled:text-gray-400 text-error hover:text-[#c65a5a]" 
            :disabled="item.in_cart" @click="listStore.deleteItem(item.id)"
          >
              <XMarkIcon class="w-5 h-5" />
          </button>
        </div>
        <div v-if="item.in_cart && !item.to_buy && !inShop" class="w-full text-error flex items-center">
          <ExclamationCircleIcon class="w-5 h-5 mr-1.5" />
          <span>This item is in cart already.</span>
        </div>
      </li>

      <li v-if="isAddItemMode" class="p-2 rounded-md mt-2 bg-main-gray" :class="{'relative z-50': commonStore.isBlurredScreen && commonStore.activeFormId === 'new_item'}">
        <NewItemForm @cancal-add-mode="toggleAddItemMode()" :categoryData="category" />
      </li>
      <li v-if="!inShop" class="flex items-center mt-2">
        <button type="button" @click="openNewItemForm">
          <PlusCircleIcon class="w-7 h-7 text-main-green"/>
        </button>
      </li>
    </ul>
  </CategoryWrapper>
  
</template>