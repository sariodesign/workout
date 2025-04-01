<script setup lang="ts">

const greetingMessage = ref('');

const date = new Date();
const formattedDate = date.toLocaleDateString('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric'
}).toLowerCase();
const currentDate = ref(formattedDate);

greetingMessage.value = getGreetingMessage(date.getHours());

</script>

<template>
  <div class="flex flex-col gap-y-1">
    <time class="font-body">{{ currentDate }}</time>
    <h1 class="font-heading text-2xl">{{ greetingMessage }}</h1>
  </div>
</template>