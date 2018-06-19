<template>
  <Modal>
    <template slot="body">
      <ol>
        <li
          v-for="bookmark in exportBookmarks"
          :key="bookmark.id">
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
</template>


<script>

import Modal from './Modal';

export default {
  name: "ExportModal",
  components: {
    Modal
  },
  props: {
    exportBookmarks: {
      type: Array,
      default: null
    }
  },
  methods: {
    handleCopy(action) {
      if (action == "copy") {
        let bookmarks = "";
        for (let i = 0; i < this.exportBookmarks.length; i++) {
          bookmarks += this.exportBookmarks[i].titletext + " : " + this.exportBookmarks[i].url + "\n";
        }

        this.$clipboard(bookmarks);
      }

      this.$emit('export', 'close');
    }
  }
};

</script>

<style scoped>

input {
  width: 80%;
}

</style>
