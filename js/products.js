//esm cdn 
import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.11/vue.esm-browser.js';

//裝bs5 modal用
let productModal = {};
let productDeleteModal = {};


//vue起手式
const app = createApp({
  data() {//一律使用 function return
    return {
      //config
      apiUrl: 'https://vue3-course-api.hexschool.io/', // 請加入站點
      //const url = 'http://localhost:3000/admin/signin/'
      apiPath: 'eva29485577', // 請加入個人 API Path  
      productsAry: [],//產品列表
      isNew: false,//判斷打開的modal是更新還是編輯
      deleteId:'',
      productTitle:'',
      tempProduct: {//修改產品預存結構要送回後端的資料
        //imagesUrl: [],//第二層結構 須遵照後端需要的格式給予資料 以免出錯
      },
    }
  },
  mounted() {//生命週期 元件生成 必定執行的項目(呼叫函式)
    //取出token 驗證
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    if (!token) {//token false
      alert('尚未登入');
      window.location = "login.html";
    }
    axios.defaults.headers.common['Authorization'] = token;

    //bs5 modal
    //編輯部分modal
    productModal = new bootstrap.Modal(document.getElementById('productEditModal'), {
      keyboard: false
    });
    //productEditModal.show();//驗證能否叫出productEditModal
    //刪除部分modal
    productDeleteModal = new bootstrap.Modal(document.getElementById('productDeleteModal'), {
      keyboard: false
    });
    //productDeleteModal.show();//驗證能否叫出productDeleteModal


    //this.getProducts();//this指向為此物件,使用vue會變為同層,故this.getProducts()即可指定到methods內的getProducts()

  },
  methods: {//函式擺放位置
    //取得後台產品資料
    getProducts() {
      // 取得 Token（Token 僅需要設定一次）已在mounted設定
      // 取得後台產品列表
      axios.get(`${this.apiUrl}api/${this.apiPath}/admin/products`) //資料庫每個人path是獨立的
        .then((res) => {
          //console.log(res); //驗證 取得產品列表res.data.products
          if (res.data.success) {//=true
            this.productsAry = res.data.products; //將空陣列賦與後台products資料
            //console.log(this.productsAry);//驗證
            //alert('已取得產品');
          } else {
            //console.log(productsData);//驗證
            alert('請重新登入!即將轉移至登入頁面!');
            setTimeout(turnLoginPage, 1000); //計時器 延遲1秒執行turnLoginPage函式
            function turnLoginPage() {
              //轉移至login.html
              window.location = "login.html";
            }
          }
        })
        .catch((error) => {//接收錯誤回傳
          // handle error
          console.log(error);
        });
    },
    //打開openNewProductModal
    openProductModal(isNew, item) {
      //data的isNew狀態改為參數帶進來的狀態
      this.isNew = isNew;
      if (this.isNew) {//如果為true
        this.tempProduct = {//每次打開modal 就先將暫存 要傳回後端的產品資料清空 做個初始化
          //imagesUrl: [],
        };
        //顯示newProductModal
        productModal.show();
      };
      if (this.isNew == false) {//如果為false
        //編輯的這區小心傳參考特性,避免未確認,原始資料就被修正
        //為了避免 這邊使用淺拷貝 指向另一記憶體避免共用
        this.tempProduct = { ...item };
        //開啟productModal
        productModal.show();
      };
    },
    //openNewProductModal內的新增陣列圖片
    createImages() {
      //新增圖片陣列
      this.tempProduct.imagesUrl = [
        ''
      ]
    },
    //打開ProductsDeleteModal 參數item為取id用
    openProductDeleteModal(item) {
      //console.log(item.id);//驗證
      this.deleteId = item.id;//將id賦予回data的deleteId
      this.productTitle = item.title;
      //console.log(this.deleteId,this.productTitle);//驗證
      productDeleteModal.show();
    },
    //新增/編輯 產品
    //管理控制台 [需驗證]-商品建立 or 修改產品
    updateProduct() {
      //新增 api/:api_path/admin/product
      let url = `${this.apiUrl}api/${this.apiPath}/admin/product`;
      //請求方法:利用變數來做陣列取[axiosMethod]值 帶到下方axios程式碼做改變請求方法
      let axiosMethod = 'post';
      //判斷isNew狀態
      if (!this.isNew) {//isNew反轉是false的話,代表是編輯
        //改成編輯api: /api/:api_path/admin/product/:id
        url = `${this.apiUrl}api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
        //請求方法改為put
        axiosMethod = 'put';
      }
      //用post請求 將暫存tempProduct傳回到後端資料庫儲存 記得帶上參數為後端要求的data格式 這邊[axiosMethod]值是post
      axios[axiosMethod](url, { data: this.tempProduct })
        .then((res) => {
          //如果回傳true
          if (res.data.success) {
            //console.log(res);//驗證
            //重新渲染畫面
            this.getProducts();
            //關閉NewProductModal
            productModal.hide();
          }
        })
        .catch((error) => {//接收錯誤回傳
          // handle error
          console.log(error);
        });


    },
    //刪除產品 需用到id來判別選到的產品品項
    //管理控制台 [需驗證]-刪除產品
    //刪除產品 需用到id來判別選到的產品品項
    deleteProduct() {
      // 刪除一個產品
      axios
        .delete(`${this.apiUrl}api/${this.apiPath}/admin/product/${this.deleteId}`)
        .then((res) => {
          if (res.data.success) {//如果回傳為true
            //console.log(res);//驗證
            alert(res.data.message);
            this.getProducts();//呼叫取得產品資料函式 並重新渲染畫面
            //關閉Modal
            productDeleteModal.hide();
          } else {//回傳非true
            console.log(res);//驗證
            alert(res.data.message);
          }
        })
        .catch((error) => {//接收錯誤回傳
          // handle error
          console.log(error);
        });
    },
  }
})
app.mount('#app');



//元件註冊
//全域-單個 前面是名稱 後面是元件內容
// app.component('',{
//   template:``,
//   data(){
//     return{

//     }
//   }
// });