<template>
  <div class="nutrition">
    <MealCard v-for="(meal, index) in meals" :key="index" :meal="meal" />
  </div>
</template>

<script>
import MealCard from "@/components/MealCard.vue";
import NutritionService from "@/services/NutritionService.js";

export default {
  name: "Nutrition",
  components: {
    MealCard,
  },
  data() {
    return {
      meals: null
    }
  },
  created() {
    NutritionService.getNutrition()
      .then(response => {
        this.meals = response.data;
        console.log('[Meal response]', this.meals);
      })
      .catch(error => {
        console.log('[ERROR]', error)
      })
  }
};
</script>

<style scoped>
.nutrition {
  padding: 0 15px;
}
</style>
