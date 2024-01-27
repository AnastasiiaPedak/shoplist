<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  id: {
    type: String,
  },
  modelValue: {
    type: String,
  },
  name: {
    type: String,
  },
  disabled: {
    type: Boolean,
  },
  v: {
    type: Object,
  },
  classes: {
    type: String,
  },
  placeholder: {
    type: String,
  },
});
const emit = defineEmits(['update:modelValue']);

const inputValue = ref(props.modelValue);

watch(
  () => props.modelValue,
  (newValue) => {
    inputValue.value = newValue;
  }
);

watch(inputValue, (newValue) => {
  emit('update:modelValue', {
    id: props.id,
    value: newValue,
    name: props.name,
  });
});
</script>

<template>
  <div>
    <input
      v-model="inputValue"
      type="text"
      :name="name"
      :disabled="disabled"
      :placeholder="placeholder"
      :class="[
        disabled
          ? classes
          : `w-full border border-gray-400 bg-main-gray rounded py-1 px-2 focus:border-main-green focus:outline-main-green text-gray-400`,
      ]"
    />
    <div v-if="v?.name?.$error" class="text-error mt-1">
      {{ v?.name?.$errors[0].$message }}
    </div>
  </div>
</template>
