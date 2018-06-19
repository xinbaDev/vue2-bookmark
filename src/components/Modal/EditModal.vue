<template>
  <Modal>
    <template slot="body">
      New Title: <input v-model="title">
    </template>

    <template slot="footer">
      <button
        class="btn btn-primary"
        @click="handleEdit('edit')">
        Edit
      </button>
      <button
        class="btn btn-secondary"
        @click="handleEdit('cancel')">
        Cancel
      </button>
    </template>
  </Modal>
</template>

<script>

import Modal from './Modal';

export default {
  name: "EditModal",
  components: {
    Modal
  },
  props: {
    title: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      newTitle: ""
    };
  },
  methods: {
    handleEdit(type) {
      if (type == "Edit") {
        this.newTitle = this.title;
        this.$emit("change", "edit", this.newTitle);
      } else {
        this.$emit("change", "cancel");
      }
    }
  }
};

</script>

<style scoped>

input {
  width: 80%;
}

</style>
