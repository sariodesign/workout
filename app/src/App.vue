<template>
  <div id="app-container">
    <router-view />
    <div id="nav" class="tab-navigation">
      <router-link to="/">Alimentazione</router-link>
      <router-link to="/exercise">Esercizi</router-link>
    </div>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500&display=swap');

body {
  margin: 0;
  
}

#app {
  font-family: 'Kanit', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}


.tab-navigation {
  background-color: #fff;
  bottom: 0;
  box-shadow: 0 -1px 15px -10px rgba(0,0,0,.75);
  display: flex;
  position: sticky;
}

.tab-navigation a {
  color: #2c3e50;
  font-weight: 500;
  padding: 30px;
  text-align: center;
  text-decoration: none;
  text-transform: uppercase;
  width: 100%;
}

.tab-navigation a.router-link-exact-active {
  box-shadow: inset 0 -8px 0px -1px;
  color: #42b983;
}

</style>
