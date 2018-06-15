import Vue from 'vue';
import App from './App.vue';
import Clipboard from 'v-clipboard';

export const eventBus = new Vue();

new Vue({
  el: '#app',
  render: h => h(App)
});

Vue.use(Clipboard);