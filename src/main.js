import Vue from 'vue';
import App from './App.vue';
import VueRangedatePicker from 'vue-rangedate-picker'

Vue.use(VueRangedatePicker)
new Vue({
  el: '#app',
  render: h => h(App)
});

