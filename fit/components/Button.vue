<script setup lang="ts">
import { defineProps } from 'vue'

interface ButtonProps {
  link: string
  text: string
}
const props = defineProps<ButtonProps>()
</script>

<template>
  <NuxtLink :to="props.link" class="bg-accent-primary text-white font-heading rounded-4xl uppercase leading-none text-xl text-center px-4 py-2">{{props.text}}</NuxtLink>
</template>