<template>
  <table class="search-result-table">
    <td 
      class="bookmarkTitle" 
      @click="toggleTitle">Title
      <span 
        v-show="sortType == 'title' && sortTitleReverse" 
        class="fa fa-caret-down sortIcon"/>
      <span 
        v-show="sortType == 'title' && !sortTitleReverse" 
        class="fa fa-caret-up sortIcon"/>
    </td>

    <td 
      class="dateAdded" 
      @click="toggleDateAdded">DateAdded
      <span 
        v-show="sortType == 'dateAdded' && sortDateReverse" 
        class="fa fa-caret-down sortIcon"/>
      <span 
        v-show="sortType == 'dateAdded' && !sortDateReverse" 
        class="fa fa-caret-up sortIcon"/>
    </td>
  </table>
</template>

<script>

export default {
  name: "ResultSorter",
  data() {
    return {
      sortType: "dateAdded",
      sortDateReverse: true,
      sortTitleReverse: false,
    };
  },
  methods: {
    toggleDateAdded() {
      this.sortType = "dateAdded"; 
      this.sortDateReverse = !this.sortDateReverse;
      this.$emit("toggleDateAdded", this.sortType, this.sortDateReverse);
    },
    toggleTitle() {
      this.sortType = "title"; 
      this.sortTitleReverse = !this.sortTitleReverse;
      this.$emit("toggleTitle", this.sortType, this.sortTitleReverse);
    }
  }
};

</script>

<style scoped>

.search-result-table {
  width: 100%;
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

</style>