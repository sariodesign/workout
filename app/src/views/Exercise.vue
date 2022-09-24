<template>
  <div class="exercise">
    <ExerciseDay />
    <Card
      v-for="(exercise, index) in exercises"
      :key="index"
      :content="exercise"
    />
  </div>
</template>

<script>
import Card from "@/components/Card.vue";
import ExerciseDay from "@/components/ExerciseDay.vue";
import GetData from "@/services/GetData.js";

export default {
  name: "Exercise",
  components: {
    Card,
    ExerciseDay
  },
  data() {
    return {
      exercises: null,
    };
  },
  created() {
    GetData.getExercise()
      .then((response) => {
        this.exercises = response.data;
      })
      .catch((error) => {
        console.log("[ERROR]", error);
      });
  },
};
</script>

<style scoped>
.exercise {
  background-color: #fefefe;
  background-size: 80px;
  min-height: 100vh;
  padding: 15px;
}
</style>
