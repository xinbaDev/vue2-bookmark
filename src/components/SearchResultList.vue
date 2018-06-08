<template>

  <div>
    <div class="folder-bar">
      <i class="folder fa fa-folder-open"/> {{ bookmarkgroup['title'] }}
    </div>
    
    <SearchBookmarkGroup 
      v-for="bookmark in bookmarkgroup['children']"
      :bookmark="bookmark"
      :key="bookmark.getID()"/>
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
};

</script>

<style scoped>
.folder {
  padding-left: 5px;
}

.folder-bar {
  line-height: 30px;
  height: 30px;
}

</style>