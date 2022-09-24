<template>
  <div class="card-container" :data-day="content.day">
    <h2 class="card-title">{{ content.day }}</h2>
    <div class="card-list" v-if="nutrition">
      <div
        class="card-detail"
        v-for="(value, name, index) in content.meals"
        :key="index"
      >
        <h3>{{ name }}</h3>
        <ul>
          <li v-for="(item, index) in value" :key="index">{{ item }}</li>
        </ul>
      </div>
    </div>
    <div class="card-item" v-else>
      <div
        class="card-detail"
        v-for="(value, name, index) in content.list"
        :key="index"
      >
        <div class="card-detail-exercise">
          <h2 class="card-exercise-name">{{ name }}</h2>
          <div class="card-exercise-detail">
            <span class="card-exercise-repeat">{{ value.repeat }}</span>
            <span class="card-exercise-time">{{ value.recovery }}</span>
          </div>
        </div>
        <div class="card-detail-weight">{{ value.weight }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Card",
  props: {
    content: Object,
    nutrition: Boolean,
    withBg: Boolean,
  },
};
</script>

<style scoped>
.card-container {
  margin-bottom: 20px;
}

.card-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
}

.card-item {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.card {
  font-size: 20px;
  font-weight: 400;
  margin: 0;
  text-transform: uppercase;
  text-align: center;
}

.card-title {
  font-weight: 500;
  margin: 0;
  padding-left: 20px;
  text-transform: capitalize;
}

.exercise .card-title {
  padding-left: 10px;
}

.card-detail {
  background-color: #fff;
  flex: 1 0 auto;
}

.card-detail h3 {
  color: #42b983;
  display: inline-block;
  font-size: 14px;
  font-weight: 500;
  margin: 0 0 4px;
  text-transform: uppercase;
}

.card-detail ul {
  line-height: 30px;
  list-style: none;
  margin: 0;
  padding: 0 0 0 8px;
}

.card-detail li:before {
  content: "-";
  margin-right: 8px;
}

.card-item .card-detail {
  border-bottom: 1px solid #777;
  border-radius: 0;
  box-shadow: none;
  box-sizing: border-box;
  padding: 10px;
  width: 100%;
}

.card-detail-exercise {
  align-items: center;
  display: flex;
  justify-content: space-between;
}

.card-exercise-detail {
  display: flex;
  flex-direction: column;
  text-align: right;
}

.card-exercise-name {
  color: #42b983;
  font-size: 16px;
  font-weight: 600;
  margin-top: 0;
  text-transform: uppercase;
}

.card-exercise-time {
  font-size: 12px;
  font-style: italic;
  font-weight: 500;
}

.card-text {
  font-size: 18px;
  font-weight: 400;
  margin: 0 0 4px;
}

.card-text-small {
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
}
</style>
