export default {
  template: "#deleteModal",
  props: ["temp-product", "delete-all"],
  data() {
    return {
      deleteModal: null,
    };
  },
  methods: {
    open() {
      this.deleteModal.show();
    },
    close() {
      this.deleteModal.hide();
    },
    deleteItem(status, product) {
      this.$emit("delete-item", status, product);
    },
  },
  mounted() {
    this.deleteModal = new bootstrap.Modal(this.$refs.deleteModal);
  },
};
