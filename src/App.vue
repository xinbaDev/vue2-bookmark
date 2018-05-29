<template>
  <div id="app">
    <link 
      rel="stylesheet" 
      href="css/font-awesome-4.6.3/css/font-awesome.min.css">
    <Header/>
    <SearchBar/>
  </div>
</template>

<script>
import SearchBar from './components/SearchBar';
import Header from './components/Header';

export default {
  name: 'App',
  date: {

  },
  components: {
    Header,
    SearchBar
  }
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
