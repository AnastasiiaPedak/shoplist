<script setup>
import { ref, reactive } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { useListStore } from '../../store/listStore';
import { maxLength, required } from '@vuelidate/validators';
import { db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { CheckIcon, XMarkIcon } from '@heroicons/vue/24/solid';
import CheckboxForm from '../common/CheckboxForm.vue';
import InputForm from '../common/InputForm.vue';
import { useCommonStore } from '../../store/сommon';

const commonStore = useCommonStore();

const listStore = useListStore();
const props = defineProps({
  categoryData: {
    type: Object,
  },
});
const emit = defineEmits(['cancalAddMode']);

const defaultNewItem = {
  name: '',
  details: '',
  category: '',
  in_cart: false,
  in_default: false,
  to_buy: true,
};
const newItem = reactive({ ...defaultNewItem });

const rules = {
  name: { required, maxLength: maxLength(50) },
  details: { maxLength: maxLength(200) },
};
const v = useVuelidate(rules, newItem);

function handleUpdate(updateData) {
  newItem[updateData.name] = updateData.value;
}

async function handleAddingItem() {
  const isFormCorrect = await v.value.$validate();
  if (!isFormCorrect) return;
  addNewItem();
}

const isAddingInPending = ref(false);

async function addNewItem() {
  const categoryRef = doc(db, `categories/${props.categoryData.id}`);
  isAddingInPending.value = true;

  try {
    const categoryDoc = await getDoc(categoryRef);

    if (categoryDoc.exists()) {
      const category = categoryDoc.data();

      const itemToAdd = {
        category: { id: categoryDoc.id, name: category.name },
        name: newItem.name,
        details: newItem.details,
        in_cart: false,
        in_default: newItem.in_default,
        to_buy: newItem.to_buy,
      };

      await listStore.addItem(itemToAdd);
      cancelAddMode();
    } else {
      console.error("Category doc doesn't exist");
    }
  } catch (err) {
    console.error('Error adding new item', err);
  } finally {
    isAddingInPending.value = false;
  }
}

function cancelAddMode() {
  emit('cancalAddMode');
  resetForm();
  commonStore.toggleBlurredScreen();
}

function resetForm() {
  Object.assign(newItem, defaultNewItem);
  v.value.$reset();
}
</script>

<template>
  <form
    class="w-full flex items-start justify-between pt-[0.65rem] flex-wrap"
    @submit.prevent="handleAddingItem"
  >
    <div class="max-w-[47%]">
      <InputForm
        type="text"
        name="name"
        :model-value="newItem.name"
        placeholder="Item name"
        :v="v"
        class="mt-1.5"
        @update:model-value="handleUpdate"
      />
      <textarea
        v-model="newItem.details"
        type="text"
        placeholder="Item details"
        class="w-full bg-main-gray border mt-3 rounded border-gray-400 py-1 px-2 focus:border-main-green focus:outline-main-green text-gray-400"
      />
      <div v-if="v.details.$error" class="text-error mt-1">
        {{ v.details.$errors[0].$message }}
      </div>
    </div>
    <div class="flex w-[53%] justify-between">
      <CheckboxForm
        id="new_item_in_default"
        :model-value="newItem.in_default"
        name="in_default"
        @update:model-value="handleUpdate"
      />
      <CheckboxForm
        id="new_item_to_buy"
        :model-value="newItem.to_buy"
        name="to_buy"
        @update:model-value="handleUpdate"
      />
      <div class="w-[20px] h-[20px]"></div>
    </div>
    <div class="flex items-center w-full justify-end">
      <button
        type="submit"
        class="text-main-green"
        :disabled="isAddingInPending"
      >
        <CheckIcon class="w-5 h-5" />
      </button>
      <button
        type="button"
        class="text-error ml-3.5"
        :disabled="isAddingInPending"
        @click="cancelAddMode"
      >
        <XMarkIcon class="w-5 h-5" />
      </button>
    </div>
  </form>
</template>
