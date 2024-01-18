<script setup>
import { ref, watch } from 'vue';

const props = defineProps(['id', 'value', 'name', 'disabled', 'v', 'classes'])
const emit = defineEmits(['update']);

const inputValue = ref(props.value);

watch(() => props.value, (newValue) => {
  inputValue.value = newValue;
});

watch(inputValue, (newValue) => {
  emit('update', { id: props.id, value: newValue, name: props.name });
});
</script>

<template>
  <div>
    <input 
      type="text" 
      :name="name"
      v-model="inputValue" 
      :disabled="disabled" 
      :class="[disabled ? classes : `bg-main-gray rounded py-1 px-2 focus:border-main-green focus:outline-main-green text-gray-400`]"
    />
    <div v-if="v?.name?.$error" class="text-error mt-1">
      {{ v?.name?.$errors[0].$message }}
    </div>
  </div>
</template>