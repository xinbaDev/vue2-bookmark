<template>
  <Modal>
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
</template>

<script>

import Modal from './Modal';

export default {
  name: "DeleteModal",
  components: {
    Modal
  },
  methods: {
    handleDelete(type) {
      if (type == "delete") {
        this.$emit("delete", "delete");
      } else {
        this.$emit("delete", "cancel");
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
