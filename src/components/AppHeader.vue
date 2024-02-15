<script setup>
import { ShoppingCartIcon } from '@heroicons/vue/24/solid';
import { useListStore } from '../store/listStore';
import { useCommonStore } from '../store/сommon';
import { onMounted, watch } from 'vue';
import { IN_SHOP_MODE, CREATE_LIST_MODE } from '../constants';

const listStore = useListStore();
const commonStore = useCommonStore();

watch(
  () => listStore.isInShopView,
  () => {
    const appMode = listStore.isInShopView ? IN_SHOP_MODE : CREATE_LIST_MODE;
    localStorage.setItem('mode', appMode);
  });

onMounted(() => {
  const modeValue = localStorage.getItem('mode') || CREATE_LIST_MODE;
  listStore.isInShopView = modeValue === IN_SHOP_MODE;
});
</script>

<template>
  <header
    class="flex justify-between items-center bg-main-green border-transparent sticky top-0 z-[60] px-6 py-8 max-h-[92px]"
  >
    <nav class="w-[45%] flex items-center justify-between" aria-label="Global">
      <div class="flex lg:flex-1">
        <a href="#" class="-m-1.5 p-1.5 flex">
          <ShoppingCartIcon class="h-6 w-6 inline fill-main-gray" />
          <h1 class="text-main-gray ml-3 inline uppercase font-bold text-xl">
            Shop List
          </h1>
        </a>
      </div>
    </nav>
    <div class="flex items-center justify-evenly">
      <label for="switch" :class="{ 'font-bold': !listStore.isInShopView }"
        >To buy</label
      >
      <label class="relative inline-flex cursor-pointer items-center mx-2">
        <input
          id="switch"
          v-model="listStore.isInShopView"
          type="checkbox"
          class="peer sr-only"
          :checked="listStore.isInShopView"
          :disabled="commonStore.isBlurredScreen"
        />
        <label for="switch" class="hidden"></label>
        <div
          class="peer h-6 w-11 rounded-full border bg-main-green after:absolute after:left-[2px] after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-gray-400 after:bg-main-gray after:checked:bg-main-green after:transition-all after:content-[''] peer-checked:bg-main-gray peer-checked:after:translate-x-full peer-checked:after:bg-main-green peer-checked:after:border-white peer-focus:ring-gray-400"
        ></div>
      </label>
      <label for="switch" :class="{ 'font-bold': listStore.isInShopView }"
        >In Shop</label
      >
    </div>
  </header>
</template>
