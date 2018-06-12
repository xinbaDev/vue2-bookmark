<template>
  <div>
    <button 
      class="btn btn-info"
      @click="openAll">
      open all
    </button>
  </div>
</template>

<script>
	export default {
    name: "SearchOperation",
    methods: {
      openAll() {
        this.$emit('operation', "openAll")
      }
    }
  };
</script>

<style scoped>
	
</style>