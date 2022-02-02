<template>
    <div class="card">
      <h2 class="card-title">{{ content.giorno }}</h2>
      <div class="card-detail" v-for="(value, name, index) in content.lista" :key="index">
        <h3>{{ name }}</h3>
        <ul>
          <li v-for="(item, index) in value" :key="index">{{ item }}</li>
        </ul>
      </div>
    </div>
</template>

<script>
export default {
  name: 'Card',
  props: {
    content: Object
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

  .card-title {
    font-size: 20px;
    font-weight: 400;
    margin: 0; 
    text-transform: uppercase;
    text-align: center;
  }

  .card-detail {
    padding: 20px;
    border-radius: 20px;
    box-shadow: 0 2px 20px -10px rgb(0 0 0 / 35%);
    background-color: #fff;
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
