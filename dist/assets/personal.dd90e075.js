var c=Object.defineProperty;var p=(a,t,n)=>t in a?c(a,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):a[t]=n;var e=(a,t,n)=>(p(a,typeof t!="symbol"?t+"":t,n),n);import{Z as s}from"./index.5670e6e0.js";class i{}e(i,"editBaseUser",t=>s.post("/api/user_setting/update",t)),e(i,"getChannelInfo",t=>s.post("/api/user_setting/getChannel",t)),e(i,"checkName",t=>s.post("/api/user_setting/checkName",t)),e(i,"updateChannel",t=>s.post("/api/user_setting/updateChannel",t)),e(i,"onlineUserInfo",t=>s.post("/api/user_setting/onlineUser",t)),e(i,"updateOnline",t=>s.post("/api/user_setting/updateOnline",t)),e(i,"assetList",t=>s.post("/api/user_setting/asset",t)),e(i,"getPromotion",t=>s.post("/api/user_setting/getPromotion",t)),e(i,"updatePromotion",t=>s.post("/api/user_setting/updatePromotion",t)),e(i,"systemSetting",t=>s.post("/api/user_setting/system",t)),e(i,"onlineMerchant",t=>s.post("/api/user_setting/onlineMerchant",t)),e(i,"updateOnlineMerchant",t=>s.post("/api/user_setting/updateOnlineMerchant",t)),e(i,"updateHead",t=>s.post("/api/user_setting/updateHead",t)),e(i,"getVerifyCode",t=>s.post("/api/verify_code/send",t)),e(i,"checkVerifyCode",t=>s.post("/api/verify_code/check",t));export{i as P};
