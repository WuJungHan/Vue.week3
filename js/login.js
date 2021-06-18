//esm cdn 
import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.11/vue.esm-browser.js';

//vue起手式
const app = createApp({
  data(){//一律使用 function return
    return{
      apiUrl:'https://vue3-course-api.hexschool.io/', // 請加入站點
      //初始化user 傳回後端驗證用
      user: {
                username: '',
                password: '',
              },
    }
  },
  mounted(){//生命週期 元件生成 必定執行的項目(呼叫函式)

  },
  methods:{//函式擺放位置
    //axios 登入
  axiosLogin() {
  //發送 API 至遠端並登入（並儲存 Token）
  //登入及驗證 - 登入 發送post請求 加上url 並在參數加上user(username password) 去做登入
  //api:/admin/signin
  axios.post(`${this.apiUrl}admin/signin`, this.user)
    .then(res => {//回傳
      if(res.data.success){//true
        //登入成功後 expired=到期日 token=憑證 (到期日過憑證就無使用) uid=實際儲存在後端使用的身分
      //console.log(res);//驗證
      const { token, expired } = res.data;//解構寫法 同上兩行 更為精簡
      //onsole.log(token,expired);//驗證
      document.cookie = `hexToken=${token}; expires=${new Date(expired)}`;//儲存token跟expired到本地cookie,new Date(expired)可以將expired轉成日期格式

      window.location = 'products.html';//轉至同層products.html
      }else{
        //console.log(res);//驗證data.message 狀態顯示
        alert(res.data.message)//登入失敗或其他情況提示
      }   
    })
    .catch((error) => {//接收錯誤回傳
      // handle error
      console.log(error);
    });
  },
  }
});
app.mount('#app');