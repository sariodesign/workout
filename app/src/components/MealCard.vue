<template>
    <div class="card">
      <div class="card-tag"></div>
      <div class="card-text"></div>
    </div>
</template>

<script>
export default {
  props: {
    meal: {
      type: Object,
      required: true
    }
  }
};
</script>

<style scoped>

</style>
