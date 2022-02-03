<template>
    <div class="card-container">
      <h2 class="card-title">{{ content.giorno }}</h2>
      <div class="card-list">
        <div class="card-detail" v-for="(value, name, index) in content.lista" :key="index">
          <h3>{{ name }}</h3>
          <ul v-if="isList">
            <li v-for="(item, index) in value" :key="index">{{ item }}</li>
          </ul>
          <div v-else>
            <p>{{ name }}: {{ value.ripetizioni }}</p>
            <span>{{ value.recupero }}</span>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  name: 'Card',
  props: {
    content: Object,
    isList: Boolean,
    withBg: Boolean
  }
};
</script>

<style scoped>
  .card-container {
    margin-bottom: 20px;
  }

  .card-list {
    display: flex;
    gap: 20px;
    overflow-x: scroll;
    padding: 20px;
  }

  .card-list::-webkit-scrollbar {
    display: none;
    scrollbar-width: none;
  }

  .card {
    font-size: 20px;
    font-weight: 400;
    margin: 0; 
    text-transform: uppercase;
    text-align: center;
  }

  .card-title {
    padding-left: 20px;
    margin: 0;
  }

  .card-detail {
    border-radius: 20px;
    box-shadow: 0 2px 20px -10px rgb(0 0 0 / 35%);
    background-color: #fff;
    flex: 1 0 auto;
    padding: 20px;
    width: 60vw;
  }

  .card-detail h3 {
    color: #42b983;
    display: inline-block;
    font-size: 14px;
    font-weight: 500;
    margin: 0 0 4px;
    padding: 4px 8px;
    text-transform: uppercase;
  }

  .card-detail ul {
    line-height: 30px;
    list-style: none;
    margin: 0;
    padding: 0 0 0 8px;
  }

  .card-detail li:before {
    content: '-';
    margin-right: 8px;
  }
</style>
