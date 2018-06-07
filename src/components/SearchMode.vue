<template>

  <div>
    <table 
      v-if="mode == 'time'" 
      class="input-table"
    >
      <td>
        <div 
          ref="reportrange" 
          class="pull-right bookmark-calendar" 
          @click="toggle">
          <i class="glyphicon glyphicon-calendar fa fa-calendar"/>
          {{ date }}
        </div>
      </td>
    </table>

    <table 
      v-if="mode != 'time'"
      class="input-table" 
    >
      <td>
        <div style="position: relative">
          <input 
            ref="search" 
            v-model="searchText" 
            class="search-input form-control fa"
            :placeholder="showNumOfBookmark()"
            @keyup="$emit('change', $event.target.value)"
          >
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
  </div>

</template>


<script>

import { eventBus } from '../main';

export default {
  name: 'SearchMode',
  props: {
    mode: {
      type: String,
      required: true
    },
    date: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      isOpenCalendar: false,
      numofbookmark: ""
    };
  },
  mounted() {
    this.$refs.search.focus();
  },
  created() {
    eventBus.$on('numofbookmark', (num) => {
      this.numofbookmark = num;
    });
  },
  methods: {
    toggle() {
      this.isOpenCalendar = !this.isOpenCalendar;
      this.$emit('toggleCalendar', this.isOpenCalendar);
    },
    showNumOfBookmark() {
      if (this.numofbookmark <= 1) {
        return "Search in your bookmarks";
      } else {
        return "Search in your " + this.numofbookmark + " bookmarks";
      }
    }
  },
};
</script>


<style scoped>
.search-input {
  padding-left: 25px;
  margin-left: 2px;
  margin-top: 1px;
}

.input-table {
    width: 99%;
}

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

</style>