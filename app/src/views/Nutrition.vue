<template>
  <div class="nutrition">
    <Calendar />
    <Card
      v-for="(meal, index) in meals"
      :key="index"
      :content="meal"
      :isList="true"
    />
  </div>
</template>

<script>
import Calendar from "@/components/Calendar.vue";
import Card from "@/components/Card.vue";
import GetData from "@/services/GetData.js";

export default {
  name: "Nutrition",
  components: {
    Calendar,
    Card,
  },
  data() {
    return {
      meals: null,
    };
  },
  created() {
    GetData.getNutrition()
      .then((response) => {
        this.meals = response.data;
      })
      .catch((error) => {
        console.log("[ERROR]", error);
      });
  },
};
</script>

<style scoped>
.nutrition {
  background-color: #fefefe;
  background-size: 80px;
  min-height: 100vh;
}
</style>
