<script setup>
const props = defineProps({
    label: String,
    value: String,
    fullWidth: Boolean,
    itemClass: String
  })
</script>

<template>
    <div :class="{'flex justify-between text-xs md:text-base': !fullWidth, 'grid grid-cols-2': fullWidth}, itemClass" class="py-0">
     <span class="text-black" :class="{'md:w-full': !fullWidth, 'md:col-span-1': fullWidth}">{{ label }}</span>
     <span class="text-black text-right  md:text-sm" :class="{'md:w-full': !fullWidth, 'md:col-span-1': fullWidth}">{{ value || '-' }}</span>
   </div>
</template>



<style scoped>
/* Custom styling for receipt */
.InfoItem {
    border-bottom: 1px solid #e5e7eb;
    padding: 0.25rem 0;
}
</style>