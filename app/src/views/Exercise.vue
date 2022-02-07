<template>
  <div class="exercise">
    <Card v-for="(exercise, index) in exercises" :key="index" :content="exercise" />
  </div>
</template>

<script>
import Card from "@/components/Card.vue";
import GetData from "@/services/GetData.js";

export default {
  name: "Exercise",
  components: {
    Card
  },
  data() {
    return {
      exercises: null
    }
  },
  created() {
    GetData.getExercise()
      .then(response => {
        this.exercises = response.data;
      })
      .catch(error => {
        console.log('[ERROR]', error)
      })
  }
};
</script>

<style scoped>
.exercise {
  background-color: #fefefe;
  background-size: 80px;
  min-height: 100vh;
  padding: 0 15px;
}
</style>
