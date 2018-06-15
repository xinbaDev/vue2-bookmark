<template>

  <div>
    <Modal v-if="showDeleteModal">

      <template slot="body">
        Delete bookmark
      </template>

      <template slot="footer">
        <button 
          class="btn btn-danger" 
          @click="handleDelete('delete')">
          Delete
        </button>
        <button 
          class="btn btn-secondary" 
          @click="handleDelete('cancel')">
          Cancel
        </button>
      </template>

    </Modal>

    <Modal v-if="showEditModal">

      <template slot="body">
        New Title: <input v-model="title">
      </template>

      <template slot="footer">
        <button 
          class="btn btn-primary" 
          @click="handleEdit('edit',title)">
          Edit
        </button>
        <button 
          class="btn btn-secondary" 
          @click="handleEdit('cancel')">
          Cancel
        </button>
      </template> 

    </Modal>

    <Modal v-if="showExport">

      <template slot="body">
        <ol>
          <li v-for="bookmark in exportBookmarks">
            {{ bookmark.titletext }} {{ bookmark.url }}
          </li>
        </ol>
      </template>

      <template slot="footer">
        <button 
          class="btn btn-primary" 
          @click="handleCopy('copy')">
          Copy
        </button>
        <button 
          class="btn btn-secondary" 
          @click="handleCopy('cancel')">
          Cancel
        </button>
      </template> 

    </Modal>

    <div v-show="booklists.length > 0">
      <SearchOperation
        class="search_operation"
        @open="handleOpen"
        @export="handleExport"/>
    </div>

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
      </table>

      <SearchResultList 
        v-for="bookmarkgroup in filteredBookmarkListsV2"
        :bookmarkgroup="bookmarkgroup"
        :key="bookmarkgroup['group']"/>

    </div>

    <div 
      v-if="isSearchByDate" 
      v-show="dateRange != null && isOpen == false"
      class="date_scrollable">
      <table
        class="search-result-table">
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
      </table>

      <SearchResultList 
        v-for="bookmarkgroup in filteredBookmarkListsV2"
        :bookmarkgroup="bookmarkgroup"
        :key="bookmarkgroup['group']"/>

    </div>  
  </div>

</template>

<script>

import Modal from "./Modal/Modal";
import bookmark from "../models/bookmark";
import SearchResultList from "./SearchResultList";
import SearchOperation from "./SearchOperation";
import { eventBus } from '../main';


export default {
  name: 'SearchResult',
  components: {
    SearchResultList,
    Modal,
    SearchOperation
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
      title:"",
      bookgroup: {},
      booklists: [],
      showExport: false,
      exportBookmarks: []
    };
  },
  computed: {
    isSearchByDate() {
      return this.mode == 'time';
    },
    showOpenAll() {
      if (this.bookmarkUrls.length > 0) {
        return true;
      } else {
        return false;
      }
    },
    filteredBookmarkLists() {
      this.booklists = [];
      let num = this.bookmarkManager.numOfBooks();
      if (this.mode == 'title') {
        for (let i = 0; i < num; i++) {
          let filtered_bookmark = this.bookmarkLists[i];
          if (filtered_bookmark.title.indexOf(this.text) != -1) {
            this.booklists.push(filtered_bookmark);
          }
        }
      } else if (this.mode == 'url') {
        for (let i = 0; i < num; i++) {
          let filtered_bookmark = this.bookmarkLists[i];
          if (filtered_bookmark.url.indexOf(this.text) != -1) {
            this.booklists.push(filtered_bookmark);
          }
        }
      } else {
        if (this.dateRange == null) {
          return [];
        }
        for (let i = 0; i < num; i++) {
          let filtered_bookmark = this.bookmarkLists[i];
          if ((this.dateRange.start < filtered_bookmark.dateAdded) && (filtered_bookmark.dateAdded < this.dateRange.end)) {
            this.booklists.push(filtered_bookmark);
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
      this.booklists.sort(function(a, b) {
        return sort(a, b, that.sortTitleReverse, that.sortDateReverse, that.sortType);
      });
 
      return this.booklists;
    },
    filteredBookmarkListsV2() {
      this.booklists = [];
      let num = this.bookmarkManager.numOfBooks();
      if (this.mode == 'title') {
        for (let i = 0; i < num; i++) {
          let filtered_bookmark = this.bookmarkLists[i];
          if (filtered_bookmark.title.toLowerCase().indexOf(this.text) != -1) {
            this.booklists.push(filtered_bookmark);
          }
        }
      } else if (this.mode == 'url') {
        for (let i = 0; i < num; i++) {
          let filtered_bookmark = this.bookmarkLists[i];
          if (filtered_bookmark.url.indexOf(this.text) != -1) {
            this.booklists.push(filtered_bookmark);
          }
        }
      } else {
        if (this.dateRange == null) {
          return [];
        }
        for (let i = 0; i < num; i++) {
          let filtered_bookmark = this.bookmarkLists[i];
          if ((this.dateRange.start < filtered_bookmark.dateAdded) && (filtered_bookmark.dateAdded < this.dateRange.end)) {
            this.booklists.push(filtered_bookmark);
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

      //remove existing bookmarks
      for (const book in this.bookgroup) {
        this.bookgroup[book]['children'] = [];
      }
      
      for (let i = 0; i < this.booklists.length; i++) {
        this.bookgroup[this.booklists[i].parentId]['children'].push(this.booklists[i]);
      }

      let books = [];
      let that = this;
      for (let group in this.bookgroup) {
        let children = this.bookgroup[group]['children'];

        if (children.length > 0) {

          children.sort(function(a, b) {
            return sort(a, b, that.sortTitleReverse, that.sortDateReverse, that.sortType);
          });
          books.push({
            'title':this.bookgroup[group]['title'], 
            'children':children,
            'count':children.length
          });
        }
      }

      return books;
    }
  },
  created() {
    this.getBookmarks();
    eventBus.$on('edit', (bookmark_id, title) => {
      this.editBookmark(bookmark_id, title);
    });

    eventBus.$on('delete', (bookmark_id) => {
      this.deleteBookmark(bookmark_id);
    });

    eventBus.$on('change_search_mode', () => {
      this.booklists = [];
    });
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
        eventBus.$emit('numofbookmark', _this.bookmarkManager.numOfBooks());
      }

      this.bookgroup = this.bookmarkManager.returnBookGroup();
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
        eventBus.$emit('numofbookmark', this.bookmarkManager.numOfBooks());
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
    },
    handleOpen(bookmarks) {
      if (bookmarks.length > 0) {
        for (let i = 0; i < bookmarks.length; i++) {
          chrome.tabs.create({url: bookmarks[i].url});
        }
      }
    },
    handleExport(bookmarks) {
      if (bookmarks.length > 0) {
        this.exportBookmarks = bookmarks;
        this.showExport = true;
      }
    },
    handleCopy(action) {
      if (action == "copy") {
        let bookmarks = "";
        for (let i = 0; i < this.exportBookmarks.length; i++) {
          bookmarks += this.exportBookmarks[i].titletext + " : " + this.exportBookmarks[i].url + "\n";
        }

        this.$clipboard(bookmarks);
      } else {
        this.showExport = false;
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
  height: 40px;
  padding: 3px 5px;
  vertical-align: middle;
}

.dateAdded {
  border: 1px solid grey;
  text-align: center;
  cursor: pointer;
  width: 20%;
  height: 40px;
  vertical-align: middle;
}

#search {
  padding-left: 30px;
}

.search-result-table {
  width: 100%;
}

.search_operation {
  padding: 3px;
}

input {
  width: 80%;
}

</style>