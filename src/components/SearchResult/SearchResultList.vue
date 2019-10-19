<template>

  <div>
    <div 
      :class="[openFolder ? '' : 'folder-bar-close']"
      class="folder-bar"
      @click="toggleFolder">
      <i 
        :class="[openFolder ? 'fa-folder-open' : 'fa-folder']"
        class="folder fa"/> 
      <span> {{ bookmarkgroup['title'] }} </span>

      <div class="inline">
        <div class="bookmark_number_circle">
          <span class="bookmark_number">{{ bookmarkgroup['count'] }} </span>
        </div>
         <div class="bookmark_path">
          <span class="bookmark_path">{{ bookmarkgroup['path'] }} </span>
        </div>
      </div>
    </div>
    
    <!-- <transition name="slide"> -->
    <SearchResultGroup
      v-for="bookmark in bookmarkgroup['children']"
      v-show="openFolder"
      :bookmark="bookmark"
      :key="bookmark.getID()"
      class="bookmark-group"/>
      <!--     </transition> -->

  </div>
  
</template>

<script>

import { eventBus } from '../../main';
import SearchResultGroup from './SearchResultGroup';

export default {
  name: "SearchResultList",
  components:{
    SearchResultGroup
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
  created() {
    eventBus.$on("folderOperation", (type) => {
      if (type == "open") {
        this.openFolder = true;
      } else {
        this.openFolder = false;
      }
    });
  },
  methods: {
    toggleFolder() {
      this.openFolder = !this.openFolder;
    }
  },
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

.folder-bar:hover {
  background-color: #82bd82;
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

.bookmark_number_circle {
  border-radius: 50%;
  background: #8c8585;
  height: 14px;
  width: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.inline {
  display: inline;
}

.bookmark_number {
  color: white;
  font-size: 9px;
}

.bookmark_path{
   display: inline-flex;
}

</style>