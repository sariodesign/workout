<template>
  <NuxtPicture
    class="object-cover absolute -top-16 left-0 w-full h-dvh z-0"
    format="avif,webp"
    src="/bg-welcome-page-x2.jpg"
    :imgAttrs="{
      class: 'w-full',      
    }"
  />
  <div class="flex flex-col fixed z-10 bottom-0 left-0 w-full bg-white before:absolute before:w-full before:bg-linear-to-t before:from-white before:to-transparent before:-top-16 before:left-0 before:h-16 p-4">
    <h1 class="font-heading text-accent-primary text-2xl leading-none mb-2">Start your workout today</h1>
    <p class="font-body text-paragraph mb-8">A <strong class="text-accent-secondary font-bold">customized</strong> plan, <strong class="text-accent-secondary font-bold">targeted</strong> exercises and <strong class="text-accent-secondary font-bold">tracked</strong> progress.</p>
    <Button :link="'/workouts'" text="Start now" />
  </div>
</template>