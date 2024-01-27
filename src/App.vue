<script setup>
import AppHeader from './components/AppHeader.vue';
import ListWrapper from './components/list/ListWrapper.vue';
import { useCommonStore } from './store/сommon';

const commonStore = useCommonStore();
</script>

<template>
  <div id="container" class="flex flex-col h-screen">
    <AppHeader />
    <ListWrapper />
    <div
      v-if="commonStore.isBlurredScreen"
      class="fixed top-0 left-0 right-0 bottom-0 z-40 backdrop-blur-[1.5px]"
    ></div>
  </div>
</template>
