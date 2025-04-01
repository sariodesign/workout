<script setup lang="ts">
import TimeIcon from '@/components/Icons/TimeIcon.vue';
import FlameIcon from '@/components/Icons/FlameIcon.vue';
import ArrowRightIcon from '@/components/Icons/ArrowRightIcon.vue';

interface DayWorkoutCardProps {
  name: string;
  exercises: number;
  minutes: number;
  calories: number;
}

const props = defineProps<DayWorkoutCardProps>();

</script>

<template>
  <div class="border-2 border-accent-primary p-4 rounded-2xl relative">
    <h2 class="font-heading font-bold text-accent-primary text-2xl leading-none mb-2">{{ props.name }}</h2>
    <p class="font-body text-paragraph leading-none mb-2">{{ props.exercises }} exercises</p>
    <div class="flex items-center text-xs">
      <div class="flex items-center">
        <TimeIcon class="w-4 h-4 mr-1" />
        <span class="font-body text-paragraph"><strong>{{ props.minutes }}</strong> min</span>
      </div>
      <div class="flex items-center ml-4">
        <FlameIcon class="w-4 h-4 mr-1" />
        <span class="font-body text-paragraph"><strong>{{ props.calories }}</strong> kcal</span>
      </div>
    </div>
    <NuxtLink to="" class="absolute top-0 left-0 w-full h-full flex flex-col items-end justify-center pr-4">
      <div class="flex items-center justify-center w-10 h-10 bg-accent-primary ml-auto rounded-full">
        <ArrowRightIcon class="w-4 h-4" />
      </div>
    </NuxtLink>
  </div>
</template>