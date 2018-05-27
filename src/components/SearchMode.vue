<template>

  <div>
    <table v-show="mode == 'time'">
      <td>
        <div 
          id="reportrange" 
          class="pull-right bookmark-calendar" >
          <i class="glyphicon glyphicon-calendar fa fa-calendar"/><span/>
        </div>
      </td>
    </table>

    <table v-show="mode != 'time'">
      <td>
        <div style="position: relative; width: 575px;">
          <input 
            ref="search" 
            v-model="searchText" 
            :placeholder="numberOfBookMarks" 
            class="form-control fa">
          <i 
            v-if="mode == 'title'" 
            class="icon-bookmark fa fa-bookmark"/>
          <i 
            v-if="mode == 'url'" 
            class="icon-link fa fa-link"/>
          <i 
            v-if="mode == 'time'" 
            class="icon-calendar fa fa-calendar"/>
        </div>
      </td>
    </table>

    <div 
      v-if="isNotEmpty()" 
      id="bookmark_scrollable">
      <table>
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
      class="bookmark_scrollable">
      <table>
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
/*  import daterangepicker from "../lib/daterangepicker"*/
export default {
  name: 'SearchMode',
  props: {
    mode: {
      type: String,
      required: true
    },
  },
  data() {
    return {
      bookmarkManager: "",
      bookmarkLists: {},
      searchText: "",
      isSearchByDate: false,
      sortType: 'title',
      sortReverse: false,
      hoverEdit: false
    };
  },
  computed: {
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
          if (filtered_bookmark.title.indexOf(this.searchText) != -1) {
            booklists.push(filtered_bookmark);
          }
        }
      } else if (this.mode == 'url') {
        for (let i = 0; i < num; i++) {
          let filtered_bookmark = this.bookmarkLists[i];
          if (filtered_bookmark.url.indexOf(this.searchText) != -1) {
            booklists.push(filtered_bookmark);
          }
        }
      } else {

      }
      return booklists;
    }
  },
  created() {
    this.getBookmarks();
  },
  mounted() {
    this.$refs.search.focus();
  },
  methods: {
    isNotEmpty() {
      return this.searchText != "";
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
.icon-calendar {
  position: absolute!important;
  z-index: 500;
  left:10px;
  top:10px;
}

.icon-link {
  position: absolute!important;
  z-index: 500;
  left: 10px;
  top: 10px;
}

.icon-bookmark {
  position: absolute!important;
  z-index: 500;
  left:10px;
  top:10px;
}

.bookmark-calendar {
  background: #fff; 
  cursor: pointer; 
  padding: 8px 12px; 
  border: 1px solid #ccc; 
  width: 100%;
  height: 34px;
}

.bookmark_scrollable {
  max-height: 300px;
  overflow-x: hidden;
}

.bookmarkTitle {
  border: 1px solid grey;
  text-align: center;
  cursor: pointer;
  width: 80%;
  height: 40px;
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
}

.title_bookmark:hover {
  background-color: lightblue;
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

.daterangepicker {
  position: absolute;
  color: inherit;
  background: #fff;
  border-radius: 4px;
  width: 278px;
  padding: 4px;
  margin-top: 1px;
  top: 100px;
  left: 20px;
}

.daterangepicker:before, .daterangepicker:after {
  position: absolute;
  display: inline-block;
  border-bottom-color: rgba(0, 0, 0, 0.2);
  content: ''; 
}

.daterangepicker:before {
  top: -7px;
  border-right: 7px solid transparent;
  border-left: 7px solid transparent;
  border-bottom: 7px solid #ccc; 
}

.daterangepicker:after {
  top: -6px;
  border-right: 6px solid transparent;
  border-bottom: 6px solid #fff;
  border-left: 6px solid transparent; 
}

.daterangepicker.opensleft:before {
  right: 9px;
}

.daterangepicker.opensleft:after {
  right: 10px; 
}

.daterangepicker.openscenter:before {
  left: 0;
  right: 0;
  width: 0;
  margin-left: auto;
  margin-right: auto; 
}

.daterangepicker.openscenter:after {
  left: 0;
  right: 0;
  width: 0;
  margin-left: auto;
  margin-right: auto; 
}

.daterangepicker.opensright:before {
  left: 9px; 
}

.daterangepicker.opensright:after {
  left: 10px; 
}
.daterangepicker.dropup {
  margin-top: -5px; 
}
.daterangepicker.dropup:before {
  top: initial;
  bottom: -7px;
  border-bottom: initial;
  border-top: 7px solid #ccc;
}
.daterangepicker.dropup:after {
  top: initial;
  bottom: -6px;
  border-bottom: initial;
  border-top: 6px solid #fff; 
}
.daterangepicker.dropdown-menu {
  max-width: none;
  min-width: 100px !important;
  z-index: 3001; 
}
.daterangepicker.single .ranges, .daterangepicker.single .calendar {
  float: none; 
}
.daterangepicker.show-calendar .calendar {
  display: block; 
}
.daterangepicker .calendar {
  display: none;
  max-width: 270px;
  margin: 4px; 
}
.daterangepicker .calendar.single .calendar-table {
  border: none; 
}
.daterangepicker .calendar th, .daterangepicker .calendar td {
  white-space: nowrap;
  text-align: center;
  min-width: 32px; 
}
.daterangepicker .calendar-table {
  border: 1px solid #fff;
  padding: 4px;
  border-radius: 4px;
  background: #fff; 
}
.daterangepicker table {
  width: 100%;
  margin: 0; 
}
.daterangepicker td, .daterangepicker th {
  text-align: center;
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border: 1px solid transparent;
  white-space: nowrap;
  cursor: pointer; 
}
.daterangepicker td.available:hover, .daterangepicker th.available:hover {
  background-color: #eee;
  border-color: transparent;
  color: inherit; 
}
.daterangepicker td.week, .daterangepicker th.week {
  font-size: 80%;
  color: #ccc; 
}
.daterangepicker td.off, .daterangepicker td.off.in-range, .daterangepicker td.off.start-date, .daterangepicker td.off.end-date {
  background-color: #fff;
  border-color: transparent;
  color: #999; 
}
.daterangepicker td.in-range {
  background-color: #ebf4f8;
  border-color: transparent;
  color: #000;
  border-radius: 0; 
}
.daterangepicker td.start-date {
  border-radius: 4px 0 0 4px; 
}
.daterangepicker td.end-date {
  border-radius: 0 4px 4px 0; 
}
.daterangepicker td.start-date.end-date {
  border-radius: 4px; 
}
.daterangepicker td.active, .daterangepicker td.active:hover {
  background-color: #357ebd;
  border-color: transparent;
  color: #fff; 
}
.daterangepicker th.month {
  width: auto; 
}
.daterangepicker td.disabled, .daterangepicker option.disabled {
  color: #999;
  cursor: not-allowed;
  text-decoration: line-through; 
}
.daterangepicker select.monthselect, .daterangepicker select.yearselect {
  font-size: 12px;
  padding: 1px;
  height: auto;
  margin: 0;
  cursor: default; 
}
.daterangepicker select.monthselect {
  margin-right: 2%;
  width: 56%; 
}
.daterangepicker select.yearselect {
  width: 40%; 
}
.daterangepicker select.hourselect, .daterangepicker select.minuteselect, .daterangepicker select.secondselect, .daterangepicker select.ampmselect {
  width: 50px;
  margin-bottom: 0; 
}
.daterangepicker .input-mini {
  border: 1px solid #ccc;
  border-radius: 4px;
  color: #555;
  height: 30px;
  line-height: 30px;
  display: block;
  vertical-align: middle;
  margin: 0 0 5px 0;
  padding: 0 6px 0 28px;
  width: 100%; 
}
.daterangepicker .input-mini.active {
  border: 1px solid #08c;
  border-radius: 4px; 
}
.daterangepicker .daterangepicker_input {
  position: relative; 
}
.daterangepicker .daterangepicker_input i {
  position: absolute;
  left: 8px;
  top: 8px; 
}
.daterangepicker.rtl .input-mini {
  padding-right: 28px;
  padding-left: 6px; 
}
.daterangepicker.rtl .daterangepicker_input i {
  left: auto;
  right: 8px; 
}
.daterangepicker .calendar-time {
  text-align: center;
  margin: 5px auto;
  line-height: 30px;
  position: relative;
  padding-left: 28px; 
}
.daterangepicker .calendar-time select.disabled {
  color: #ccc;
  cursor: not-allowed; 
}

.ranges {
  font-size: 11px;
  float: none;
  margin: 4px;
  text-align: left; 
}
.ranges ul {
  list-style: none;
  margin: 0 auto;
  padding: 0;
  width: 100%; 
}
.ranges li {
  font-size: 13px;
  background: #f5f5f5;
  border: 1px solid #f5f5f5;
  border-radius: 4px;
  color: #08c;
  padding: 3px 12px;
  margin-bottom: 8px;
  cursor: pointer; 
}
.ranges li:hover {
  background: #08c;
  border: 1px solid #08c;
  color: #fff; 
}
.ranges li.active {
  background: #08c;
  border: 1px solid #08c;
  color: #fff; 
}

/*  Larger Screen Styling */
@media (min-width: 564px) {
  .daterangepicker {
    width: auto;
  }
  .daterangepicker .ranges ul {
    width: 118px; 
  }
  .daterangepicker.single .ranges ul {
    width: 100%; 
  }
  .daterangepicker.single .calendar.left {
    clear: none;
  }
  .daterangepicker.single.ltr .ranges, .daterangepicker.single.ltr .calendar {
    float: left; 
  }
  .daterangepicker.single.rtl .ranges, .daterangepicker.single.rtl .calendar {
    float: right; 
  }
  .daterangepicker.ltr {
    direction: ltr;
    text-align: left; 
  }
  .daterangepicker.ltr .calendar.left {
    clear: left;
    margin-right: 0; 
  }
  .daterangepicker.ltr .calendar.left .calendar-table {
    border-right: none;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0; 
   }
  .daterangepicker.ltr .calendar.right {
    margin-left: 0; 
  }
  .daterangepicker.ltr .calendar.right .calendar-table {
    border-left: none;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0; 
  }
  .daterangepicker.ltr .left .daterangepicker_input {
        padding-right: 12px; 
  }
  .daterangepicker.ltr .calendar.left .calendar-table {
    padding-right: 12px; 
  }
  .daterangepicker.ltr .ranges, .daterangepicker.ltr .calendar {
    float: left; 
  }
  .daterangepicker.rtl {
    direction: rtl;
    text-align: right;
  }
  .daterangepicker.rtl .calendar.left {
    clear: right;
    margin-left: 0; 
  }
  .daterangepicker.rtl .calendar.left .calendar-table {
    border-left: none;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0; 
  }
  .daterangepicker.rtl .calendar.right {
    margin-right: 0; 
  }
  .daterangepicker.rtl .calendar.right .calendar-table {
    border-right: none;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0; 
  }
  .daterangepicker.rtl .left .daterangepicker_input {
    padding-left: 12px; 
  }
  .daterangepicker.rtl .calendar.left .calendar-table {
    padding-left: 12px; 
  }
  .daterangepicker.rtl .ranges, .daterangepicker.rtl .calendar {
    text-align: right;
    float: right; 
  } 
}

@media (min-width: 730px) {
  .daterangepicker .ranges {
    width: auto; 
  }
  .daterangepicker.ltr .ranges {
    float: left; 
  }
  .daterangepicker.rtl .ranges {
    float: right; 
  }
  .daterangepicker .calendar.left {
    clear: none !important; 
  } 
}

</style>