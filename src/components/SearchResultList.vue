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
  color: #fbc80d;
}

.folder-bar {
  line-height: 30px;
  height: 30px;
  background-color: #e8f3e8!important;;
  border-left: 4px solid #ccc!important;
  border-color: #2196F3!important;
  border-right: 1px solid;
}

</style>