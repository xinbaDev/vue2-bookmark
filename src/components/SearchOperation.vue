<template>
  <div v-show="bookmark_urls.length > 0">
    <button 
      class="btn btn-info"
      @click="openAll">
      open({{ bookmark_urls.length }})
    </button>
  </div>
</template>

<script>

import { eventBus } from '../main';

export default {
  name: "SearchOperation",
  data() {
    return {
      bookmark_urls: [],
    };
  },
  created() {
    eventBus.$on('checked', (bookmark_url, type) => {
      if (type == true) {
        this.bookmark_urls.push(bookmark_url);
      } else {
        let index = this.bookmark_urls.indexOf(bookmark_url);
        this.bookmark_urls.splice(index, 1);
      }
    });
  },
  methods: {
    openAll() {
      this.$emit('operation', this.bookmark_urls);
    }
  },
};

</script>

<style scoped>

</style>