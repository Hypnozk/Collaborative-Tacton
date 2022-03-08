<template>
  <nav>
    <router-link to="/devices">Devices</router-link> |
    <router-link to="/">Play Ground</router-link>
  </nav>
  <router-view />
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  display: flex;
  padding-top: 10px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
  padding-right: 10px;
  padding-left: 10px;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
