<template>
    <div class="card">
      <h2 class="card-day">{{ meal.giorno }}</h2>
      <div class="card-detail" v-for="(value, name, index) in meal.pasti" :key="index">
        <h3>{{ name }}</h3>
        <ul>
          <li v-for="(item, index) in value" :key="index">{{ item }}</li>
        </ul>
      </div>
    </div>
</template>

<script>
export default {
  name: 'MealCard',
  props: {
    meal: Object
  }
};
</script>

<style scoped>
  .card {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-bottom: 40px;
  }

  .card-day {
    margin: 0; 
  }

  .card-detail {
    border-radius: 20px;
    box-shadow: 0 2px 12px -4px rgb(0,0,0,.3);
    padding: 12px;
  }

  .card-detail h3 {
    font-weight: 500;
    margin: 0 0 4px;
    text-transform: uppercase;
  }

  .card-detail ul {
    line-height: 30px;
    margin: 0;
    padding: 0 0 0 20px;
  }
</style>
