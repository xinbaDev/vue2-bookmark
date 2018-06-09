<template>

  <div>
    <div 
      :class="[openFolder ? '' : 'folder-bar-close']"
      class="folder-bar"
      @click="toggleFolder">
      <i 
        :class="[openFolder ? 'fa-folder-open' : 'fa-folder']"
        class="folder fa"/> 
      {{ bookmarkgroup['title'] }} ({{ bookmarkgroup['count'] }} bookmarks found)
    </div>
    
    <!-- <transition name="slide"> -->
    <SearchBookmarkGroup
      v-for="bookmark in bookmarkgroup['children']"
      v-show="openFolder"
      :bookmark="bookmark"
      :key="bookmark.getID()"
      class="bookmark-group"/>
      <!--     </transition> -->

  </div>
  
</template>

<script>

import SearchBookmarkGroup from './SearchBookmarkGroup';

export default {
  name: 'SearchResultList',
  components:{
    SearchBookmarkGroup
  },
  props: {
    bookmarkgroup: {
      type: Object,
      required: true
    },
  },
  data() {
    return {
      openFolder: true
    };
  },
  methods: {
    toggleFolder() {
      this.openFolder = !this.openFolder;
    }
  }
};

</script>

<style scoped>

.folder {
  padding-left: 5px;
  color: #fbc80d;
}

.folder-bar {
  line-height: 30px;
  height: 30px;
  background-color: #e8f3e8;
  border-left: 4px solid #ccc;
  border-color: #2196F3;
  border-right: 1px solid;
  cursor: pointer;
}

.folder-bar-close {
  border-bottom: 1px solid #6d5858;
}

.slide-enter {

}

.slide-enter-active {
  animation: slide-in 0.5s ease-out forwards;
}

.slide-leave {

}

.slide-leave-active {
  animation: slide-out 0.5s ease-out forwards;
}

@keyframes slide-in {
  from {
    transform: translateY(-20px);
  }
  to {
    transform: translateY(0);
  }
}

@keyframes slide-out {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-20px);
  }
}

</style>