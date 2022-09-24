<template>
  <div class="calendar">
    <select class="calendar-day" @change.self="changeDay">
      <option v-for="(day, index) in week" :key="index" :value="day" >{{ day }}</option>
    </select>
  </div>
</template>

<script>
export default {
  name: "Calendar",
  data() {
    let week = ["Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato", "Domenica"];
    return {
      week,
    };
  },
  methods: {
    changeDay(e) {
      let daySelect = e.target.value.toLowerCase();
      let dayListSelected = document.querySelector(".card-container[data-day=" + daySelect + "]");
      dayListSelected.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  },
};
</script>

<style scoped>
.calendar {
  background-color: #fff;
  bottom: 100px;
  display: flex;
  justify-content: space-between;
  position: fixed;
  right: 20px;
  width: fit-content
}

.calendar-day {
  padding: 8px 16px;
  width: 100%;
}

.calendar-day.selected {
  box-shadow: inset 0 -4px 0px -1px;
  color: #42b983;
}
</style>
