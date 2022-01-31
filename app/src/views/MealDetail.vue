<template>
    <div></div>
</template>

<script>
import NutritionService from '@/services/NutritionService.js';

export default {
  data() {
    let date = new Date();
    let today = date.getDate();
    console.log('Print today', today);

    return {
      meal: null,
      day: today
    }
  },
  created() {
    NutritionService.getNutritionDay(this.day)
      .then(response => {
        this.meal = response.data;
      })
      .catch(error => {
        console.log('[ERROR]', error)
      })
  }
}
</script>