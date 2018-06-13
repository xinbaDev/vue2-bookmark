<template>
  <div class="search-operation">
    <button 
      class="btn btn-info float-right"
      @click="handleFolderOperation"> 
      {{ folderOpen? "colapse":"open" }}
    </button>
    <button 
      v-show="bookmark_urls.length > 0"
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
      folderOpen: true
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
    },
    handleFolderOperation() {
      this.folderOpen = !this.folderOpen;
      if (this.folderOpen) {
        eventBus.$emit('folderOperation', 'open');
      } else {
        eventBus.$emit('folderOperation', 'close');
      }
    }
  },
};

</script>

<style scoped>

.float-right {
  float: right;
}

.search-operation {
  display: flow-root;
}

</style>