<script setup>
import { ref, toRefs, computed } from 'vue';
import { onClickOutside, useToggle } from '@vueuse/core';
import {
  XMarkIcon,
  EllipsisVerticalIcon,
  PencilSquareIcon,
  TrashIcon,
  CheckIcon,
} from '@heroicons/vue/24/solid';
import { useCategoriesStore } from '../../store/categoriesStore';
import { useListStore } from '../../store/listStore';
import { useCommonStore } from '../../store/сommon';
import { maxLength, required } from '@vuelidate/validators';
import { useVuelidate } from '@vuelidate/core';
import InputForm from '../common/InputForm.vue';

const commonStore = useCommonStore();
const categoriesStore = useCategoriesStore();
const listStore = useListStore();
const [isCategoryMenuOpen, toggleCategoryMenu] = useToggle();
const [isCategoryEditMode, toggleCategoryEditMode] = useToggle();

const menu = ref(null);

onClickOutside(menu, () => {
  toggleCategoryMenu();
});

const props = defineProps({
  inputProps: {
    type: Object,
  },
  isAddCategoryModeOpen: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(['closeAddCategoryMode']);
const { inputProps } = toRefs(props);
const categoryExists = computed(() => !!inputProps?.value?.id);
const isClickableForm = computed(
  () =>
    commonStore.isBlurredScreen &&
    commonStore.activeFormId ===
      `form-${categoryRef.value.id || 'new_category'}`
);

const initialCategory = categoryExists.value
  ? {
      ...inputProps.value,
      inputName: 'category',
      id: inputProps.value.id,
    }
  : {
      name: '',
      inputName: 'new_category',
    };
const categoryRef = ref(initialCategory);

const rules = {
  name: { required, maxLength: maxLength(50) },
};
const v = useVuelidate(rules, categoryRef);

function handleInputUpdate(updateData) {
  categoryRef.value.name = updateData.value;
}

function openEditCategoryMode() {
  commonStore.setActiveFormId(`form-${categoryRef.value.id}`);
  commonStore.toggleBlurredScreen();
  toggleCategoryEditMode();
  toggleCategoryMenu();
}

function closeForm() {
  if (categoryExists.value) {
    cancelCategoryEditMode();
  } else {
    emit('closeAddCategoryMode');
    commonStore.toggleBlurredScreen();
  }
}

async function handleCategoryEditing() {
  const isFormCorrect = await v.value.$validate();
  if (!isFormCorrect) return;

  if (categoryExists.value) {
    editCategory();
  } else {
    createCategory();
  }
}

const isInPending = ref(false);

async function editCategory() {
  isInPending.value = true;
  try {
    await categoriesStore.updateCategoryAndReferences(categoryRef.value);
    cancelCategoryEditMode();
  } catch (err) {
    console.error(err);
  } finally {
    isInPending.value = false;
  }
}

function cancelCategoryEditMode() {
  toggleCategoryEditMode();
  categoryRef.value = { ...inputProps.value, id: inputProps.value.id };
  v.value.$reset();
  commonStore.toggleBlurredScreen();
}

async function createCategory() {
  isInPending.value = true;
  try {
    await categoriesStore.addCategory(categoryRef.value);
    emit('closeAddCategoryMode');
    commonStore.toggleBlurredScreen();
  } catch (err) {
    console.error(err);
  } finally {
    isInPending.value = false;
  }
}
</script>

<template>
  <form
    class="flex justify-between items-baseline"
    :class="{ 'relative z-50': isClickableForm }"
    @submit.prevent="handleCategoryEditing"
  >
    <div class="flex items-baseline justify-between w-2/3">
      <InputForm
        :id="categoryRef.id || 'new_category'"
        :name="categoryRef.inputName"
        :model-value="categoryRef.name"
        :disabled="!isCategoryEditMode && categoryExists"
        :v="v"
        :classes="
          isCategoryEditMode || props.isAddCategoryModeOpen
            ? ''
            : 'text-[#F5F5F5] text-lg bg-[#000000]'
        "
        @update:model-value="handleInputUpdate"
      />
      <div
        v-if="isCategoryEditMode || !categoryExists"
        class="flex items-baseline ml-3"
      >
        <button type="submit" :disabled="isInPending">
          <CheckIcon class="w-5 h-5 text-main-green" />
        </button>
        <button type="button" :disabled="isInPending">
          <XMarkIcon class="w-5 h-5 text-error ml-3.5" @click="closeForm" />
        </button>
      </div>
    </div>

    <div v-if="categoryExists && !listStore.isInShopView" class="relative">
      <EllipsisVerticalIcon
        class="h-5 w-5 text-gray-400"
        @click="toggleCategoryMenu()"
      />
      <div
        v-if="isCategoryMenuOpen"
        ref="menu"
        class="absolute top-0 right-4 bg-main-gray z-10 rounded-md border border-[#080808] overflow-hidden"
      >
        <ul>
          <li class="text-gray-400 hover:bg-[#080808]">
            <button
              type="button"
              class="w-full flex items-center p-3"
              @click="openEditCategoryMode"
            >
              <PencilSquareIcon class="w-4 h-4" />
              <span class="ml-2">Rename</span>
            </button>
          </li>
          <li class="text-error flex items-center hover:bg-[#080808]">
            <button
              type="button"
              class="w-full flex items-center p-3"
              @click="categoriesStore.deleteCategoryAndReferences(categoryRef)"
            >
              <TrashIcon class="w-4 h-4" />
              <span class="ml-2">Delete</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  </form>
</template>
