<template>
  <div class="nutrition">
    <Calendar />
    <MealCard v-for="(meal, index) in meals" :key="index" :meal="meal" />
  </div>
</template>

<script>
import Calendar from "@/components/Calendar.vue";
import MealCard from "@/components/MealCard.vue";
import NutritionService from "@/services/NutritionService.js";

export default {
  name: "Nutrition",
  components: {
    Calendar,
    MealCard
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
  background-color: #fefefe;
  min-height: 100vh;
  padding: 0 15px;
}
</style>
