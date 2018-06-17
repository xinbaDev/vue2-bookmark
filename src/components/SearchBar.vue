<template>

  <div>
    <div class="input-group">

      <div 
        class="input-group-addon btn_toggle" 
        @click="isOpen = !isOpen">
        <i class="fa fa-search"/>
        <i 
          v-show="!isOpen" 
          class="fa fa-angle-right"/>
        <i 
          v-show="isOpen" 
          class="fa fa-angle-left"/>

      </div>

      <div 
        v-if="isOpen" 
        class="toggle-menu">
        <li><div 
          class="btn_toggle" 
          @click="titleClick"><i class="fa fa-bookmark"/> Title<i 
            v-show="mode == 'title'" 
            class="fa fa-check"/></div></li>
        <li><div 
          class="btn_toggle" 
          @click="urlClick"><i class="fa fa-link"/> URL<i 
            v-show="mode == 'url'" 
            class="fa fa-check"/></div></li>
        <li><div 
          class="btn_toggle" 
          @click="timeClick"><i class="fa fa-calendar"/> Time<i 
            v-show="mode == 'time'" 
            class="fa fa-check"/></div></li>
      </div>
      
      <SearchMode 
        :mode="mode"
        :date="date"
        @change="change"
        @toggleCalendar="toggle"/>

    </div>

    <SearchResult 
      :mode="mode" 
      :text="search_text"
      :date-range="dateRange"
      :is-open="openCalendar"/>

    <VueRangedatePicker 
      :is-open="openCalendar"
      @selected="setSelectedDate"
      @openCal="calendarOpen"/>

  </div>

</template>

<script>

import fecha from "fecha";
import SearchMode from "./SearchMode";
import SearchResult from "./SearchResult/SearchResult";
import VueRangedatePicker from "./RangedatePicker";
import { eventBus } from "../main";

export default {
  name: "SearchBar",
  components: {
    SearchMode,
    SearchResult,
    VueRangedatePicker
  },
  data() {
    return {
      isOpen: false,
      mode: "title",
      search_text: "",
      openCalendar: false,
      date: "",
      dateRange: null
    };
  },
  methods: {
    titleClick() {
      this.mode = "title";
      this.isOpen = false;
      this.openCalendar = false;
      eventBus.$emit("change_search_mode", "title");
    },
    urlClick() {
      this.mode = "url";
      this.isOpen = false;
      this.openCalendar = false;
      eventBus.$emit("change_search_mode", "url");
    },
    timeClick() {
      this.mode = "time";
      this.isOpen = false;
      this.openCalendar = false;
      eventBus.$emit("change_search_mode", "time");
    },
    change(value) {
      this.search_text = value;
    },
    toggle() {
      this.openCalendar = !this.openCalendar;
    },
    setSelectedDate(value) {
      this.dateRange = value;
      let startdate = this.getDateString(value.start);
      let enddate = this.getDateString(value.end);
      let start_date = startdate.split(" ");
      let end_date = enddate.split(" ");
      if (startdate && enddate) {
        this.date = start_date[3] + " " + start_date[1] + " " + start_date[2] + 
                    " -- " + 
                    end_date[3] + " " + end_date[1] + " " + end_date[2];
      } else {
        this.date = "";
      }
      
    },
    getDateString(date, format = this.format) {
      if (!date) {
        return null;
      }
      const dateparse = new Date(Date.parse(date));
      return fecha.format(new Date(dateparse.getFullYear(), dateparse.getMonth(), dateparse.getDate() - 1), format);
    },
    calendarOpen(value) {
      this.openCalendar = value;
    }
  }
};
</script>


<style scoped>

.input-group .form-control, .input-group-addon, .input-group-btn {
  display: table-cell;
}

.toggle-menu{
  position:absolute;
  z-index: 1000;
  
  list-style: none;
  box-shadow: 0 6px 12px rgba(0,0,0,.175);
  background-color: white;
  margin-top: 3px;
  margin-left: 3px;
}

.toggle-menu>li{
  display:inline-block;
  /* padding-right:15px; */
}

.toggle-menu>li:hover{
  color: #262626;
  text-decoration: none !important;
  background-color: #f5f5f5;
}

.toggle-menu>li>div{
  height:30px;
  padding-top: 4px;
}

.btn_toggle{
  position: relative;

  outline: 0;
  padding: 0 2rem;
  text-transform: uppercase;
  vertical-align: middle;
  -webkit-tap-highlight-color: transparent;

  text-decoration: none;
  color: #fff;
  background-color: #26a69a;
  text-align: center;
  letter-spacing: .5px;
  transition: .2s ease-out;
  cursor: pointer;
  height: 35px;
}

.btn_toggle:hover{
  background-color: #2bbbad;
  color: #333;
}

</style>