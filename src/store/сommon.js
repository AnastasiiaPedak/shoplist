import { defineStore } from 'pinia';
import { useToggle } from '@vueuse/core';
import { ref } from 'vue';

export const useCommonStore = defineStore('common', () => {
const [isBlurredScreen, toggleBlurredScreen] = useToggle();
const activeFormId = ref('');

function setActiveFormId (id) {
  activeFormId.value = id;
}

  return {
    isBlurredScreen,
    toggleBlurredScreen,
    activeFormId,
    setActiveFormId
  }
})