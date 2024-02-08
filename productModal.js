//使用預設匯出
export default {
  //template綁定id="userProductModal"的子元件架構，也可以直接將架構寫在這裡
  template: "#userProductModal",

  props: ["temp-product"], //接收由父元件傳進來的tempProduct

  data() {
    return {
      productModal: null, //需要建bs的modal實例，先定義一個productModal為空值
      product: {
        qty: 1,
      },
    };
  },
  methods: {
    open() {
      this.productModal.show(); //將modal實例使用bs的js方法
    },
    close() {
      this.productModal.hide();
    },
    //子元件點擊時，觸發addToCart方法
    //該方法會使用$emit把子元件的tempProduct,qty綁定到自定義的add-to-cart方法
    addToCart(tempProduct, qty) {
      this.$emit("add-to-cart", tempProduct, qty);
    },
  },
  watch: {
    tempProduct() {
      //   console.log("temp變化了", this.tempProduct, this.product.qty);
      this.product.qty = 1;
      //   console.log("temp修改回1", this.tempProduct, this.product.qty);
    },
  },
  //掛載完畢後，將bs的modal實例賦值到productModal
  //使用$refs取得ref="modal"的架構
  mounted() {
    this.productModal = new bootstrap.Modal(this.$refs.modal);
  },
};
