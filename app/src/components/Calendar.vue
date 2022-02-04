<template>
    <div class="calendar">
      <div class="calendar-day" v-for="(day, index) in week" :key="index" @click="select">{{ day }}</div>
    </div>
</template>

<script>
export default {
  name: 'Calendar',
  data() {
    let week = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];
    return {
      week
    }
  },
  methods: {
    select(e) {
      let dayNode = document.querySelectorAll('.calendar-day');
      dayNode.forEach( day => day.classList.remove('selected'));
      //element.scrollIntoView();
      e.target.classList.add('selected');
      console.log(dayNode);
    }
  }
};
</script>

<style scoped>
  .calendar {
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    position: sticky;
    top: 0;
  }

  .calendar-day {
    padding: 16px 8px;
  }

  .calendar-day.selected {
    box-shadow: inset 0 -4px 0px -1px;
    color: #42b983;
  }
</style>