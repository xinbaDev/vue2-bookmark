<template>
  <div>

    <DeleteModal 
      v-if="showDeleteModal" 
      @close="handleDelete"
    />

    <EditModal 
      v-if="showEditModal" 
      :title='title'
      @close="handleEdit"
    />

    <div 
      v-if="isNotEmpty() && !isSearchByDate" 
      class="list_scrollable">
      <table class="search-result-table">
        <td 
          class="bookmarkTitle" 
          @click="sortType = 'title'; sortTitleReverse = !sortTitleReverse">Title
          <span 
            v-show="sortType == 'title' && sortTitleReverse" 
            class="fa fa-caret-down sortIcon"/>
          <span 
            v-show="sortType == 'title' && !sortTitleReverse" 
            class="fa fa-caret-up sortIcon"/>
        </td>

        <td 
          class="dateAdded" 
          @click="sortType = 'dateAdded'; sortDateReverse = !sortDateReverse">DateAdded
          <span 
            v-show="sortType == 'dateAdded' && sortDateReverse" 
            class="fa fa-caret-down sortIcon"/>
          <span 
            v-show="sortType == 'dateAdded' && !sortDateReverse" 
            class="fa fa-caret-up sortIcon"/>
        </td>

        <SearchResultList 
          v-for="bookmark in filteredBookmarkLists"
          :bookmark="bookmark"
          :key="bookmark.getID()"
          @delete="deleteBookmark"
          @edit="editBookmark"
        />
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
          @click="sortType = 'title'; sortTitleReverse = !sortTitleReverse">Title
          <span 
            v-show="sortType == 'title' && !sortTitleReverse" 
            class="fa fa-caret-down sortIcon"/>
          <span 
            v-show="sortType == 'title' && sortTitleReverse" 
            class="fa fa-caret-up sortIcon"/>
        </td>

        <td 
          class="dateAdded" 
          @click="sortType = 'dateAdded'; sortDateReverse = !sortDateReverse">DateAdded
          <span 
            v-show="sortType == 'dateAdded' && !sortDateReverse" 
            class="fa fa-caret-down sortIcon"/>
          <span 
            v-show="sortType == 'dateAdded' && sortDateReverse" 
            class="fa fa-caret-up sortIcon"/>
        </td>

        <SearchResultList 
          v-for="bookmark in filteredBookmarkLists"
          :bookmark="bookmark"
          :key="bookmark.getID()"
          @delete="deleteBookmark"
          @edit="editBookmark"
        />
        
      </table>
    </div>  

  </div>

</template>

<script>

import EditModal from "./EditModal";
import DeleteModal from "./DeleteModal";
import bookmark from "../models/bookmark";
import SearchResultList from "./SearchResultList";

export default {
  name: 'SearchResult',
  components: {
    SearchResultList,
    DeleteModal,
    EditModal
  },
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
      sortType: 'date',
      sortDateReverse: true,
      sortTitleReverse: false,
      showDeleteModal: false,
      showEditModal: false,
      title:""
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

      function sort(a, b, titleReverse, dateReserve, type) {
        if (b.isImportant > a.isImportant) {
          return 1;
        } else if (b.isImportant < a.isImportant) {
          return -1;
        } else {
          if (type == "title") {
            if (titleReverse) {
              return (b.title > a.title) ? 1 : -1;
            } else {
              return (a.title > b.title) ? 1 : -1;
            }
          } else {
            if (dateReserve) {
              return (b.dateAdded > a.dateAdded) ? 1 : -1;
            } else {
              return (a.dateAdded > b.dateAdded) ? 1 : -1;
            }
          }
        }
      }

      let that = this;
      booklists.sort(function(a, b) {
        return sort(a, b, that.sortTitleReverse, that.sortDateReverse, that.sortType);
      });
 
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
    getBookmarks() {
      this.bookmarkManager = new bookmark();

      if (this.bookmarkManager.numOfBooks() == 0) {
        chrome.bookmarks.getTree(getBookmarksCallback);
      }

      let _this = this;
      function getBookmarksCallback(booklist) {
        _this.bookmarkManager.getBookmarks(booklist);
        _this.bookmarkLists = _this.bookmarkManager.returnBookmarks();
      }
    },
    deleteBookmark(bookmark_id) {
      this.bookmark_id = bookmark_id;
      this.showDeleteModal = true;
    },
    handleDelete(result) {
      this.showDeleteModal = false;
      if (result != 'cancel') {
        this.bookmarkManager.deleteBookmarks(this.bookmark_id);
        chrome.bookmarks.remove(this.bookmark_id);
      }
    },
    editBookmark(bookmark_id, title) {
      this.bookmark_id = bookmark_id;
      this.title = title;
      this.showEditModal = true;
    },
    handleEdit(result, mod_title) {
      this.showEditModal = false;
      if (result != 'cancel') {
        this.bookmarkManager.editBookmarks(this.bookmark_id, mod_title);
        chrome.bookmarks.update(this.bookmark_id, {title:mod_title});
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

#search {
  padding-left: 30px;
}

.search-result-table {
  width: 100%;
}

</style>