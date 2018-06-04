<template>
  <tr>
    <td 
      class="title_bookmark" 
      @mouseover="hoverEdit = true" 
      @mouseleave="hoverEdit = false"
    > 
      <img :src = "bookmark? bookmark.getFavIcon():''">
      <a 
        href="" 
        @click="openLink(bookmark.url)">{{ bookmark? bookmark.titletext:"" }}</a> 

      <i 
        v-show="bookmark? bookmark.isImportant:false" 
        class="fa fa-star icon_yellow moreControlOpt" 
        @click="changeImportance(bookmark)"/>

      <i 
        v-show="hoverEdit == true" 
        class="fa fa-sm fa-trash moreControlOpt"
        @click="deleteBookmark(bookmark.getID())" 
      />

      <i 
        v-show="hoverEdit == true" 
        class="fa fa-sm fa-edit moreControlOpt"
        @click="editBookmark(bookmark.getID(), bookmark.title)" 
      />

      <i 
        v-show="hoverEdit == true && !bookmark.isImportant"
        class="fa fa-star-o moreControlOpt"
        @click="changeImportance(bookmark)" 
      />

    </td>
    <td class="date_bookmark">
      {{ bookmark? bookmark.getDate():"" }}
    </td>
  </tr>
</template>

<script>

export default {
  name: 'SearchResultList',
  props: {
    bookmark: {
      type: Object,
      required: true
    },
  },
  data() {
    return {
      hoverEdit: false
    };
  },
  methods: {
    openLink(url) {
      chrome.tabs.create({url: url});
    },
    changeImportance(bookmark) {
      let id = bookmark.getID();

      if (bookmark.isImportant) {
        chrome.bookmarks.update(id,{title:bookmark.title});
      } else {
        chrome.bookmarks.update(id,{title:bookmark.title + "***"});
      }

      bookmark.isImportant = !bookmark.isImportant;
    },
    deleteBookmark(bookmark_id) {
      this.$emit('delete', bookmark_id);
    },
    editBookmark(bookmark_id, title) {
      this.$emit('edit', bookmark_id, title);
    }
  }
};

</script>


<style scoped>

.icon_yellow {
  color: gold;
}

.moreControlOpt{
  float: right;
  cursor: pointer;
}

.moreControlOpt:hover {
  border: 1px solid grey;
} 

.title_bookmark {
  border: 1px solid grey;
  width: 80%;
  padding: 3px 5px;
}

.title_bookmark:hover {
  background-color: lightblue;
}

.title_bookmark img {
  margin-right: 3px;
}

.date_bookmark{
  border: 1px solid grey;
  text-align: center;
  width: 20%;
}

</style>