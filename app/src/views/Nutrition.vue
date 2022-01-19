<template>
  <div class="nutrition">
    <MealCard/>
  </div>
</template>

<script>
// @ is an alias to /src
import MealCard from "@/components/MealCard.vue";
import axios from 'axios';

export default {
  name: "nutrition",
  components: {
    MealCard,
  },
  data() {
    return {
      meals: null
    }
  },
  created() {
    const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    let day = new Date();
    let today = weekday[day.getDay()].toLowerCase();
    console.log(today);
    axios.get('http://my-json-server.typicode.com/sariodesign/workout/nutrition')
      .then(response => {
        //this.meals = response.data
        console.log('[LOAD RESPONSE]')
        console.log(response.data);
      })
      .catch(error => {
        console.log('[ERROR]', error)
      })
  }
};
</script>
