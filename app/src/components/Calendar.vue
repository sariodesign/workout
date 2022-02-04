<template>
    <div class="calendar">
      <div class="calendar-day" v-for="(day, index) in week" :key="index" @click="select" :data-select="index" :class="{ 'selected': index === today }">{{ day }}</div>
    </div>
</template>

<script>
export default {
  name: 'Calendar',
  data() {
    let date = new Date();
    let week = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];
    let today = date.getDay();
    return {
      week,
      today
    }
  },
  methods: {
    select(e) {
      let daySelect = e.target.dataset.select;
      let dayNode = document.querySelectorAll('.calendar-day');
      let listNode = document.querySelectorAll('.card-container');
      dayNode.forEach( day => day.classList.remove('selected'));
      e.target.classList.add('selected');
      listNode[daySelect].scrollIntoView({behavior: "smooth", block: "center"});
    }
  }
};
</script>

<style scoped>
  .calendar {
    background-color: rgba(255,255,255,.85);
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