<template>
  <div class="search-operation">
    <button 
      class="btn btn-info"
      @click="handleFolderOperation"> 
      {{ folderOpen? "colapse":"open" }}
    </button>
    <button 
      v-show="bookmarks.length > 0"
      class="btn btn-info"
      @click="handleExport"> 
      export( {{ bookmarks.length }} )
    </button>
    <button 
      v-show="bookmarks.length > 0"
      class="btn btn-info"
      @click="openAll">
      open({{ bookmarks.length }})
    </button>
  </div>
</template>

<script>

import { eventBus } from '../../main';

export default {
  name: "SearchOperation",
  data() {
    return {
      bookmarks: [],
      folderOpen: true
    };
  },
  created() {
    eventBus.$on('checked', (bookmark, type) => {
      if (type == true) {
        this.bookmarks.push(bookmark);
      } else {
        let index = this.bookmarks.indexOf(bookmark);
        this.bookmarks.splice(index, 1);
      }
    });
  },
  methods: {
    openAll() {
      this.$emit('open', this.bookmarks);
    },
    handleFolderOperation() {
      this.folderOpen = !this.folderOpen;
      if (this.folderOpen) {
        eventBus.$emit('folderOperation', 'open');
      } else {
        eventBus.$emit('folderOperation', 'close');
      }
    },
    handleExport() {
      this.$emit('export', this.bookmarks);
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