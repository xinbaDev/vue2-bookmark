<template>

  <div>
    <DeleteModal
      v-if="showDeleteModal"
      @delete="handleDelete"/>

    <EditModal
      v-if="showEditModal"
      :title="title"
      @change="handleEdit"/>

    <ExportModal
      v-if="showExportModal"
      :export-bookmarks="exportBookmarks"
      @export="handleCopy"/>

    <div v-show="showSearchResultOperation()">
      <SearchResultOperation
        class="search_operation"
        @open="handleOpen"
        @export="handleExport"/>
    </div>

    <div
      v-if="isNotEmpty() && !isSearchByDate"
      class="list_scrollable">

      <ResultSorter
        @toggleTitle="handleToggleTitle"
        @toggleDateAdded="handleToggleDateAdded"/>

      <SearchResultList
        v-for="bookmarkgroup in bookmarkGroups"
        :bookmarkgroup="bookmarkgroup"
        :key="bookmarkgroup['group']"/>

    </div>

    <div
      v-if="isSearchByDate"
      v-show="dateRange != null && isOpen == false"
      class="date_scrollable">

      <ResultSorter
        @toggleTitle="handleToggleTitle"
        @toggleDateAdded="handleToggleDateAdded"/>

      <SearchResultList
        v-for="bookmarkgroup in bookmarkGroups"
        :bookmarkgroup="bookmarkgroup"
        :key="bookmarkgroup['group']"/>

    </div>
  </div>

</template>

<script>


import ExportModal from "../Modal/ExportModal";
import DeleteModal from "../Modal/DeleteModal";
import EditModal from "../Modal/EditModal";
import bookmark from "../../models/bookmark";
import ResultSorter from "./ResultSorter";
import SearchResultList from "./SearchResultList";
import SearchResultOperation from "./SearchResultOperation";
import { eventBus } from "../../main";
import { sortBookmark, filterBookmarkByText, filterBookmarkByDateRange } from '../../utils';

let _ = require('lodash');

export default {
  name: "SearchResult",
  components: {
    SearchResultList,
    EditModal,
    DeleteModal,
    ExportModal,
    SearchResultOperation,
    ResultSorter
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
      bookmarkManager: {},
      bookmarkLists: {},
      bookgroup: {},
      bookmarkGroups: {},
      booklists: [],
      exportBookmarks: [],

      sortType: 'date',
      sortDateReverse: true,
      sortTitleReverse: false,

      showDeleteModal: false,
      showEditModal: false,
      showExportModal: false,

      bookmark_id: null,
      title:"",
    };
  },
  computed: {
    isSearchByDate() {
      return this.mode == 'time';
    },
  /*    filteredBookmarkLists() {
      if (this.mode != 'time') {
        this.booklists = filterBookmarkByText(this.bookmarkLists, this.text, this.mode);
      } else {
        this.booklists = filterBookmarkByDateRange(this.bookmarkLists, this.dateRange);
      }

      let that = this;
      this.booklists.sort(function(a, b) {
        return sortBookmark(a, b, that.sortType, that.sortTitleReverse, that.sortDateReverse, );
      });

      return this.booklists;
    }*/
  },
  watch: {
    text: function(new_text, old_text) {
      this.debouncedFilterBookmark();
    },
    dateRange: function(new_dateRange, old_dateRange) {
      this.debouncedFilterBookmark();
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
      //monkey patch, force search result to refresh
      //TODO: find a better way to refresh result
      this.text = "";
      this.dateRange = null;
    });

    eventBus.$on('checked', (bookmark, checked) => {
      for (let i = 0; i < this.bookmarkLists.length; i++) {
        if (this.bookmarkLists[i].id == bookmark.id) {
          this.bookmarkLists[i]['checked'] = checked;
        }
      }
    });
    this.debouncedFilterBookmark = _.debounce(this.filterBookmark, 100);
  },
  methods: {
    showSearchResultOperation() {
      if (this.mode != "time") {
        if (this.text == "") {
          return false;
        }
      }
      return this.booklists.length > 0;
    },
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
        this.debouncedFilterBookmark();
      }
    },
    editBookmark(bookmark_id, title) {
      this.bookmark_id = bookmark_id;
      this.title = title;
      this.showEditModal = true;
    },
    handleEdit(result, new_title) {
      this.showEditModal = false;
      if (result != 'cancel') {
        this.bookmarkManager.editBookmarks(this.bookmark_id, new_title);
        chrome.bookmarks.update(this.bookmark_id, {title:new_title});
        this.debouncedFilterBookmark();
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
        this.showExportModal = true;
      }
    },
    handleCopy() {
      this.showExportModal = !this.showExportModal;
    },
    handleToggleDateAdded(sortType, sortDateReverse) {
      this.sortType = sortType;
      this.sortDateReverse = sortDateReverse;
    },
    handleToggleTitle(sortType, sortTitleReverse) {
      this.sortType = sortType;
      this.sortTitleReverse = sortTitleReverse;
    },
    filterBookmark() {
      if (this.mode != 'time') {
        this.booklists = filterBookmarkByText(this.bookmarkLists, this.text, this.mode);
      } else {
        this.booklists = filterBookmarkByDateRange(this.bookmarkLists, this.dateRange);
      }

      //remove existing bookmarks
      for (const book in this.bookgroup) {
        this.bookgroup[book]['children'] = [];
      }

      //populate
      for (let i = 0; i < this.booklists.length; i++) {
        let groupId = this.booklists[i].parentId;
        this.bookgroup[groupId]['children'].push(this.booklists[i]);
      }

      this.bookmarkGroups = [];
      let that = this;
      for (let group in this.bookgroup) {
        let children = this.bookgroup[group]['children'];

        if (children.length > 0) {
          children.sort(function(a, b) {
            return sortBookmark(a, b, that.sortType, that.sortTitleReverse, that.sortDateReverse, );
          });
          this.bookmarkGroups.push({
            'title':this.bookgroup[group]['title'],
            'children':children,
            'count':children.length
          });
        }
      }
    }
  }
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

#search {
  padding-left: 30px;
}

.search_operation {
  padding: 3px;
  border-bottom-style: ridge;
}

</style>
