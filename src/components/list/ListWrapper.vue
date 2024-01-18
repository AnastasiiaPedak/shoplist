<script setup>
import { computed } from 'vue';
import { useListStore } from '../../store/listStore';
import { useCategoriesStore } from '../../store/categoriesStore';
import { useToggle } from '@vueuse/core';
import Category from './Category.vue';
import CategoryHeaderForm from './CategoryHeaderForm.vue';
import CategoryWrapper from './CategoryWrapper.vue';
import { PlusIcon, TrashIcon } from '@heroicons/vue/24/solid';
import { useCommonStore } from '../../store/сommon';

const [isAddCategoryModeOpen, toggleCategoryModeOpen] = useToggle();

const listStore = useListStore();
const categoriesStore = useCategoriesStore();
const commonStore = useCommonStore();

const inShop = computed(() => listStore.isInShopView);

function getDataToShow (category) {
  const filteredByCategoryData = listStore.data.filter((item) => item.category.id === category.id);

  if (listStore.isInShopView) {
    return filteredByCategoryData.filter((item) => item.to_buy || item.in_cart);
  } else {
    return filteredByCategoryData;
  }
}

function openAddCategoryForm() {
  toggleCategoryModeOpen();
  commonStore.setActiveFormId(`form-new_category`);
  commonStore.toggleBlurredScreen();
}
</script>

<template>
  <main class="flex-1 overflox-y-auto p-6 bg-[#000000]">
    <KeepAlive>
      <div class="h-full">
        <div class="flex justify-between items-center">
          <h2 class="text-xl text-gray-400 font-bold uppercase">
            {{ inShop ? 'In shop' : 'To buy' }}
          </h2>
          <button v-if="!inShop" type="button" class="flex items-center bg-error px-4 py-2 rounded-md" @click="listStore.clearList">
            <TrashIcon class="w-5 h-5 mr-1" />
            <span>Clear all</span>
          </button>
        </div>
        <div class="list-container flex flex-col mt-5">
          <div class="flex justify-between">
            <div class="w-[47%]"></div>
            <div class="w-[53%] flex" :class="[inShop ? 'justify-end' : 'justify-between']">
              <h5 v-if="!inShop" class="text-[#F5F5F5] text-md flex-1">
                Default
              </h5>
              <h5 v-if="!inShop" class="text-[#F5F5F5] text-md flex-1">
                To buy
              </h5>
              <h5 
                class="text-[#F5F5F5] text-md flex-1"
                :class="[inShop ? 'text-end visible pr-4' : 'invisible']"
              >
                In cart
              </h5>
            </div>
          </div>
          <div v-for="item in categoriesStore.data" :key="item.id">
            <Category :category="item" :data-to-show="getDataToShow(item)" />
          </div>
          <CategoryWrapper v-if="isAddCategoryModeOpen">
            <CategoryHeaderForm @close-add-category-mode="toggleCategoryModeOpen()" />
          </CategoryWrapper>
          <div v-if="!inShop" class="flex mt-5 justify-center">
            <button type="button" @click="openAddCategoryForm" class="bg-main-green rounded-full p-2 hover:bg-main-green-hover">
              <PlusIcon class="w-7 h-7 text-[#000000]"/>
            </button>
          </div>
        </div>
      </div>
    </KeepAlive>
  </main>
</template>