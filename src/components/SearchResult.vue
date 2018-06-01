<template>
  <div>
    <div 
      v-if="isNotEmpty() && !isSearchByDate" 
      class="list_scrollable">
      <table class="search-result-table">
        <td 
          class="bookmarkTitle" 
          @click="sortType = 'title'; sortReverse = !sortReverse">Title
          <span 
            v-show="sortType == 'title' && sortReverse" 
            class="fa fa-caret-down sortIcon"/>
          <span 
            v-show="sortType == 'title' && !sortReverse" 
            class="fa fa-caret-up sortIcon"/>
        </td>

        <td 
          class="dateAdded" 
          @click="sortType = 'dateAdded'; sortReverse = !sortReverse">DateAdded
          <span 
            v-show="sortType == 'dateAdded' && sortReverse" 
            class="fa fa-caret-down sortIcon"/>
          <span 
            v-show="sortType == 'dateAdded' && !sortReverse" 
            class="fa fa-caret-up sortIcon"/>
        </td>

        <tr v-for="bookmark in filteredBookmarkLists">
          <td 
            class="title_bookmark" 
            @mouseover="hoverEdit = true" 
            @mouseleave="hoverEdit = false"> 
              
            <img :src = "bookmark? bookmark.getFavIcon():''">
            <a 
              href="" 
              @click="openLink(bookmark.url)">{{ bookmark? bookmark.titletext:"" }}</a> 
            <!-- <i ng-attr-id="{{'moreControlOpt_' + bookmark.getID()}}" class="fa fa-sm fa-caret-square-o-down moreControlOpt"></i> -->
            
            <i 
              v-show="bookmark? bookmark.isImportant:false" 
              class="fa fa-star icon_yellow moreControlOpt" 
              @click="changeImportance(bookmark)"/>
            

              <!-- <i v-show="hoverEdit == true" @click="deleteBookmarks(bookmark.getID())" class="fa fa-sm fa-trash moreControlOpt"></i>
              <i v-show="hoverEdit == true" @click="editBookmarks(bookmark.getID(),bookmark.title)" class="fa fa-sm fa-edit moreControlOpt"></i> -->
              <!-- <i v-show="hoverEdit == true && !bookmark.isImportant" @click="changeImportance(bookmark)" class="fa fa-star-o moreControlOpt"> </i> -->

          </td>
          <td class="date_bookmark">
            {{ bookmark? bookmark.getDate():"" }}
          </td>
        </tr>
        
      </table>
    </div>

    <div 
      v-if="isSearchByDate" 
      class="date_scrollable">
      <table
        v-show="dateRange != null && isOpen == false"
        class="search-result-table"
      >
        <td 
          class="bookmarkTitle" 
          @click="sortType = 'title'; sortReverse = !sortReverse">Title
          <span 
            v-show="sortType == 'title' && sortReverse" 
            class="fa fa-caret-down sortIcon"/>
          <span 
            v-show="sortType == 'title' && !sortReverse" 
            class="fa fa-caret-up sortIcon"/>
        </td>

        <td 
          class="dateAdded" 
          @click="sortType = 'dateAdded'; sortReverse = !sortReverse">DateAdded
          <span 
            v-show="sortType == 'dateAdded' && sortReverse" 
            class="fa fa-caret-down sortIcon"/>
          <span 
            v-show="sortType == 'dateAdded' && !sortReverse" 
            class="fa fa-caret-up sortIcon"/>
        </td>
        
        <tr v-for="bookmark in filteredBookmarkLists">
          <td 
            class="title_bookmark" 
            @mouseover="hoverEdit = true" 
            @mouseleave="hoverEdit = false"> 
              
            <img :src = "bookmark? bookmark.getFavIcon():''">
            <a 
              href="" 
              @click="openLink(bookmark.url)">{{ bookmark? bookmark.titletext:"" }}</a> 
            
            <i 
              v-show="bookmark? bookmark.isImportant:false" 
              class="fa fa-star icon_yellow moreControlOpt" 
              @click="changeImportance(bookmark)"/>
            
            
              <!-- <i v-show="hoverEdit == true" @click="deleteBookmark(bookmark.getID())" class="fa fa-sm fa-trash moreControlOpt"></i>
              <i v-show="hoverEdit == true" @click="editBookmark(bookmark.getID(),bookmark.title)" class="fa fa-sm fa-edit moreControlOpt"></i> -->
              <!-- <i v-show="hoverEdit == true && !bookmark.isImportant" @click="changeImportance(bookmark)" class="fa fa-star-o moreControlOpt"> </i> -->
              
          </td>
          <td class="date_bookmark">
            {{ bookmark? bookmark.getDate():"" }}
          </td>
        </tr>
      </table>
    </div>  

  </div>

</template>

<script>


import bookmark from "../models/bookmark";

export default {
  name: 'SearchResult',
  props: {
    mode: {
      type: String,
      required: true
    },
    text: {
      type: String,
      default: ""
    },
    dateRange: {
      type: Object,
      default: null
    },
    isOpen: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      bookmarkManager: "",
      bookmarkLists: {},
      sortType: 'title',
      sortReverse: false,
      hoverEdit: false
    };
  },
  computed: {
    isSearchByDate() {
      return this.mode == 'time';
    },
    numberOfBookMarks() {
      if (this.bookmarkManager) {
        let num = this.bookmarkManager.numOfBooks();
        if (num <= 1) {
          return "Search in your bookmarks";
        } else {
          return "Search in your " + num + " bookmarks";
        }
      }
      return "Search in your bookmarks";
    },
    filteredBookmarkLists() {
      let booklists = [];
      let num = this.bookmarkManager.numOfBooks();
      if (this.mode == 'title') {
        for (let i = 0; i < num; i++) {
          let filtered_bookmark = this.bookmarkLists[i];
          if (filtered_bookmark.title.indexOf(this.text) != -1) {
            booklists.push(filtered_bookmark);
          }
        }
      } else if (this.mode == 'url') {
        for (let i = 0; i < num; i++) {
          let filtered_bookmark = this.bookmarkLists[i];
          if (filtered_bookmark.url.indexOf(this.text) != -1) {
            booklists.push(filtered_bookmark);
          }
        }
      } else {
        if (this.dateRange == null) {
          return [];
        }
        for (let i = 0; i < num; i++) {
          let filtered_bookmark = this.bookmarkLists[i];
          if ((this.dateRange.start < filtered_bookmark.dateAdded) && (filtered_bookmark.dateAdded < this.dateRange.end)) {
            booklists.push(filtered_bookmark);
          }
        }
      }
      return booklists;
    }
  },
  created() {
    this.getBookmarks();
  },
  methods: {
    isNotEmpty() {
      return this.text != "";
    },
    openLink(url) {
      chrome.tabs.create({url: url});
    },
    changeImportance(bookmark) {
      let id = bookmark.getID();

      if (bookmark.isImportant) {
        chrome.bookmarkmarks.update(id,{title:bookmark.title});
      } else {
        chrome.bookmarkmarks.update(id,{title:bookmark.title + "***"});
      }

      bookmark.isImportant = !bookmark.isImportant;
    },
    /* deleteBookmark(bookmark) {

    },
    editBookmark(bookmark) {

    }*/
    getBookmarks() {
      let _this = this;
      this.bookmarkManager = new bookmark();
      console.log(this.bookmarkManager);

      if (this.bookmarkManager.numOfBooks() == 0) {
        chrome.bookmarks.getTree(getBookmarksCallback);
      }

      function getBookmarksCallback(booklist) {
        _this.bookmarkManager.getBookmarks(booklist);
        _this.bookmarkLists = _this.bookmarkManager.returnBookmarks();
      }
    }
  },
};
</script>
<style scoped>

.list_scrollable {
  max-height: 640px;
  overflow-x: hidden;
}

.date_scrollable {
  max-height: 300px;
  overflow-x: hidden;
}

.bookmarkTitle {
  border: 1px solid grey;
  text-align: center;
  cursor: pointer;
  width: 80%;
  line-height: 40px;
  padding: 3px 5px;
}

.dateAdded {
  border: 1px solid grey;
  text-align: center;
  cursor: pointer;
  width: 20%;
  height: 40px;
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

.moreControlOpt{
  float: right;
  cursor: pointer;
}

.moreControlOpt:hover {
  border: 1px solid grey;
} 

#search {
  padding-left: 30px;
}

.search-result-table {
  width: 100%;
}

</style>