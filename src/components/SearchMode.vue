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
            class="search-input form-control fa"
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

export default {
  name: 'SearchMode',
  props: {
    mode: {
      type: String,
      required: true
    },
  },
  mounted() {
    this.$refs.search.focus();
  }
};
</script>


<style scoped>
.search-input {
  padding-left: 25px;
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