import { createApp } from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";
//匯入元件
import userProductModal from "./productModal.js";
import deleteModal from "./deleteModal.js";

//表單驗證規則
Object.keys(VeeValidateRules).forEach((rule) => {
  if (rule !== "default") {
    VeeValidate.defineRule(rule, VeeValidateRules[rule]);
  }
});
// 讀取外部的資源
VeeValidateI18n.loadLocaleFromURL("./zh_TW.json");

// Activate the locale
VeeValidate.configure({
  generateMessage: VeeValidateI18n.localize("zh_TW"),
  validateOnInput: true, // 調整為：輸入文字時，就立即進行驗證
});

const app = Vue.createApp({
  data() {
    return {
      products: [], //全部商品
      tempProduct: {}, //選擇商品
      cartOrder: [], //購物車清單
      status: {
        loading: "", //點擊狀態
      },
      form: {
        //結帳表單
        user: {
          name: "",
          email: "",
          tel: "",
          address: "",
        },
        message: "",
      },

      deleteAll: false, //判斷是否全部清空
    };
  },

  components: {
    userProductModal,
    deleteModal,
  },
  methods: {
    //取得商品
    getProducts() {
      axios
        .get("https://ec-course-api.hexschool.io/v2/api/cd131423/products")
        .then((res) => {
          this.products = res.data.products;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //打開彈窗
    openModal(status, product) {
      if (status === "add") {
        this.tempProduct = product; //筆記：把點擊的參數product放入選擇商品tempProduct
        this.$refs.userModal.open(); //筆記：子元件使用userModal綁定元件，使用$refs.userModal取得該元件，並使用裡面的元件方法
      } else if (status === "delete") {
        this.tempProduct = product;
        this.$refs.deleteModal.open();
        this.deleteAll = false;
      } else if (status === "deleteAll") {
        this.$refs.deleteModal.open();
        this.deleteAll = true;
      }
    },
    //加入購物車
    addToCart(product, qty = 1) {
      this.$refs.userModal.close();
      this.status.loading = product.id; //筆記：將商品id 賦值給loading狀態，在html裡使用id 比對就可以讓loading icon啟動
      let data = {
        product_id: product.id,
        qty: qty,
      };
      axios
        .post("https://ec-course-api.hexschool.io/v2/api/cd131423/cart", {
          data: data,
        })
        .then((res) => {
          this.status.loading = ""; //筆記：取得完資料後，清空綁定資料，loading icon 的id無法比對就會停止
          this.getOrder();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //取得購物車清單
    getOrder() {
      axios
        .get("https://ec-course-api.hexschool.io/v2/api/cd131423/cart")
        .then((res) => {
          this.cartOrder = res.data.data; //將值賦值給購物清單
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //更新購物車數量
    updateOrderQty(product, qty = 1) {
      let data = {
        product_id: product.product.id,
        qty: qty,
      };
      axios
        .put(
          `https://ec-course-api.hexschool.io/v2/api/cd131423/cart/${product.id}`,
          {
            data: data,
          }
        )
        .then((res) => {
          console.log(res);
          this.getOrder();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //刪除購物車品項
    deleteItem(status, product) {
      if (status === true) {
        axios
          .delete(`https://ec-course-api.hexschool.io/v2/api/cd131423/carts`)
          .then((res) => {
            this.getOrder();
            this.$refs.deleteModal.close();
          })
          .catch((err) => {
            console.log(err);
          });
      } else if (status === false) {
        axios
          .delete(
            `https://ec-course-api.hexschool.io/v2/api/cd131423/cart/${product.id}`
          )
          .then((res) => {
            this.$refs.deleteModal.close();
            this.getOrder();
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    //送出表單
    onSubmit() {
      const data = this.form;
      axios
        .post("https://ec-course-api.hexschool.io/v2/api/cd131423/order", {
          data: data,
        })
        .then((res) => {
          console.log(res);
          this.$refs.form.resetForm();
          this.getOrder();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // isPhone(value) {
    //   const phoneNumber = /(^09|\+?8869)\d{2}(-?\d{3}-?\d{3})$/;
    //   return phoneNumber.test(value) ? true : "需要正確的電話號碼";
    // },
    isPhone() {
      const phoneNumber = /^(09\d{8})$/;
      return phoneNumber.test(this.form.user.tel) || "請填寫正確的電話號碼";
    },
  },
  mounted() {
    this.getProducts();
    this.getOrder();
  },
});

// 步驟 2：註冊元件
app.component("VForm", VeeValidate.Form);
app.component("VField", VeeValidate.Field);
app.component("ErrorMessage", VeeValidate.ErrorMessage);
app.mount("#app");
