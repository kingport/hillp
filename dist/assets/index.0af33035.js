import{r as m,u as d,j as s,b as e,S as l,s as u}from"./index.5670e6e0.js";import{H as o}from"./index.04556cd2.js";/* empty css                    *//* empty css                 */const x="_manage_sufel_1",f={manage:x};function p(c){const{accountType:a}=c,[t,n]=m.exports.useState(!1),i=d();return s("div",{className:"flex flex-col items-end fixed bottom-26 right-5",children:[s("div",{className:`flex flex-col ${t?"":"hidden"}`,children:[e("div",{className:"flex flex-col",children:s("div",{className:"flex items-center",children:[e("p",{className:"opacity-80 px-2 py-1 rounded-lg mr-4 text-sm text-color-[#ffffff] bg-[#2A4948]",children:"\u6DFB\u52A0\u65B0\u670D\u52A1"}),e("div",{onClick:()=>i("/manage/add/service"),className:"flex shadow-sm justify-center w-[64px] h-[64px] rounded-2xl bg-[#2A4948] items-center",children:e(l,{name:"add-serve",className:"w-[25px] h-[30px]",style:{color:"#FFF"}})})]})}),e("div",{className:"flex mt-4 flex-col",children:s("div",{className:"flex items-center",children:[e("p",{className:"opacity-80 px-2 py-1 rounded-lg mr-4 text-sm text-color-[#ffffff] bg-[#2A4948]",children:"\u6DFB\u52A0\u65B0\u5BA2\u6237"}),e("div",{onClick:()=>i("/manage/add/customer"),className:"flex shadow-sm justify-center w-[64px] h-[64px] rounded-2xl bg-[#2A4948] items-center",children:e(l,{name:"add-customer",className:"w-[25px] h-[30px]",style:{color:"#FFF"}})})]})}),e("div",{className:"flex mt-4 flex-col",children:s("div",{className:"flex items-center",children:[s("p",{className:"opacity-80 px-2 py-1 rounded-lg mr-4 text-sm text-color-[#ffffff] bg-[#2A4948]",children:[a===2&&"\u6DFB\u52A0\u65B0\u5458\u5DE5",a===1&&"\u6DFB\u52A0\u65B0\u6E20\u9053"]}),e("div",{onClick:()=>{a===2&&i("/manage/add/employee"),a===1&&i("/manage/add/channel")},className:"flex shadow-sm justify-center w-[64px] h-[64px] rounded-2xl bg-[#2A4948] items-center",children:e(l,{name:a===1?"add-chanel":"add-employee",className:"w-[25px] h-[30px]",style:{color:"#FFF"}})})]})})]}),e("div",{onClick:()=>{n(()=>!t)},className:`flex mt-4 shadow-sm ${t?"bg-[#ffffff]":"bg-[#9ECED2]"}  w-[64px] h-[64px] rounded-2xl items-center justify-center`,children:e(l,{name:`${t?"nav-cancel":"add"}`,className:"w-[23px] h-[23px]",style:{color:t?"#000":"#FFF"}})})]})}function y(){const c=d(),a=u.getState().global.userInfo,[t]=m.exports.useState(2),n=(a==null?void 0:a.user_type)===1?"\u6E20\u9053":"\u5458\u5DE5",i=()=>{(a==null?void 0:a.user_type)===1&&c("/manage/channel/list",{state:{account:t}}),(a==null?void 0:a.user_type)===2&&c("/manage/employee/list",{state:{account:t}})},r=()=>s("div",{className:"flex flex-col",children:[s("div",{onClick:i,className:"active:bg-[#f9f9fa] flex items-center justify-between py-9 px-11",children:[s("div",{className:"flex flex-col",children:[s("p",{className:"text-sm text-color-[#2A4948]",children:[n,"\u5217\u8868"]}),s("p",{className:"text-xs text-color-[#646464]",children:["\u6D4F\u89C8",n,"\u4FE1\u606F\u53CA\u72B6\u6001"]})]}),e(l,{name:"verify-right",className:"w-[6px] h-[10px]"})]}),e("div",{className:"border-b"}),s("div",{onClick:()=>c("/manage/service/list"),className:"active:bg-[#f9f9fa] flex items-center justify-between py-9 px-11",children:[s("div",{className:"flex flex-col",children:[e("p",{className:"text-sm text-color-[#2A4948]",children:"\u670D\u52A1\u5217\u8868"}),e("p",{className:"text-xs text-color-[#646464]",children:"\u6DFB\u52A0\u6216\u5220\u9664\u670D\u52A1"})]}),e(l,{name:"verify-right",className:"w-[6px] h-[10px]"})]}),e("div",{className:"border-b"}),s("div",{onClick:()=>c("/manage/customer/list"),className:"active:bg-[#f9f9fa] flex items-center justify-between py-9 px-11",children:[s("div",{className:"flex flex-col",children:[e("p",{className:"text-sm text-color-[#2A4948]",children:"\u5BA2\u6237\u5217\u8868"}),e("p",{className:"text-xs text-color-[#646464]",children:"\u67E5\u770B\u548C\u7F16\u8F91\u5BA2\u6237\u8D44\u6599"})]}),e(l,{name:"verify-right",className:"w-[6px] h-[10px]"})]})]});return s("div",{className:`${f.manage} pt-[48px]`,children:[e(o,{title:"\u7BA1\u7406",border:!0,renderLeft:!1,renderRight:!1}),r(),e(p,{accountType:a==null?void 0:a.user_type})]})}export{y as default};
