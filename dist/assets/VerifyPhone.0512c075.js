import{u as C,R as f,r as b,j as r,b as t,S as n,B as w}from"./index.5670e6e0.js";import{D as E}from"./dropdown.706ec38f.js";import{F as l}from"./index.11c9b67d.js";import{I as v}from"./index.66fe089c.js";import{P as F}from"./index.77a6b2f7.js";import{E as k}from"./index.1c39e7a0.js";import{u as A}from"./useRegionArea.dccea8fa.js";import{u as B}from"./index.5733fb44.js";import{s as a}from"./index.module.62e464a3.js";/* empty css                    *//* empty css                 */import"./PurePanel.2a417db7.js";import"./index.42a6e0fb.js";import"./index.92e459fd.js";import"./collapse.e34cf270.js";import"./useFlexGapSupport.172cfcf4.js";import"./is-node-with-content.f661b98b.js";import"./interopRequireDefault.fc5525a1.js";import"./dev-log.6e115cc9.js";import"./index.31244c45.js";import"./index.cb878f88.js";import"./convert-px.daab3cc2.js";import"./CloseCircleFill.55d4b485.js";import"./bound.bddb6539.js";import"./index.c6660251.js";import"./use-gesture-react.esm.346ddc85.js";import"./rubberband.c88fa690.js";function te(){const c=C(),[h,p]=f.useState(!1),[u,m]=f.useState([""]),[d]=l.useForm(),i=B(document.querySelector("body")),{area:o}=A();b.exports.useEffect(()=>{var e;m([(e=o[0])==null?void 0:e.name])},[o]);const x=async()=>{await d.validateFields().then(async e=>{var s;u&&(e.area_id=(s=o.find(N=>N.name===u[0]))==null?void 0:s.id),e.type=2,c("/user/verify/sms",{state:{formData:e}})})},y=e=>{e!=null&&e.key&&m([o.find(s=>Number(s.value)===Number(e==null?void 0:e.key)).label])};return r("div",{className:`${a.verifyPhone} px-8 pt-10`,children:[r("div",{className:"flex items-center justify-between sm:hidden",children:[t(n,{onClick:()=>c(-1),name:"user-left",className:"w-[26px] h-[12px] ml-2"}),t(n,{name:"logo",className:"w-[84px] h-[20px] -ml-[26px]"}),t("div",{})]}),r("div",{className:"bg-[#fff] shadow-sm py-8 px-5 mt-15 flex flex-col items-center justify-between rounded-md w-full sm:w-500px sm:m-auto sm:mt-100px",children:[r("div",{className:"flex flex-col justify-center items-center w-full pb-10",children:[t("p",{className:"text-color-[#2A4948] font-600",children:"\u9A8C\u8BC1\u60A8\u7684\u624B\u673A\u53F7\u7801"}),t("p",{className:"text-xs pt-10 text-color-[#9e9e9e]",children:"\u4E3A\u4E86\u4FDD\u62A4\u60A8\u7684\u5E10\u6237\uFF0C\u6211\u4EEC\u5C06\u53D1\u9001\u4E00\u4E2A"}),t("p",{className:"text-xs text-color-[#9e9e9e]",children:"\u56DB\u4F4D\u6570\u4EE3\u7801\u7684\u77ED\u4FE1\u5230\u4EE5\u4E0B\u624B\u673A\u53F7\u7801"})]}),t(l,{form:d,className:"w-[90%]",requiredMarkStyle:"none",footer:t(w,{onClick:x,block:!0,type:"submit",color:"primary",loading:"auto",loadingIcon:t(k,{}),children:"\u9A8C\u8BC1"}),children:t(l.Item,{name:"phone",label:"\u624B\u673A\u53F7\u7801",rules:[{required:!0}],children:r("div",{className:a.phone,children:[r("div",{onClick:()=>{(i==null?void 0:i.width)&&(i==null?void 0:i.width)<=640&&p(!0)},className:`${a.phoneCode} text-xs w-60px h-full px-2 flex items-center justify-center`,children:[t("span",{className:"w-30px sm:hidden",children:u}),t(E,{menu:{items:o,onClick:y},className:"<sm:hidden min-w-40px text-center",children:t("a",{onClick:e=>e.preventDefault(),children:u})}),t(n,{name:"phone-bottom",className:"w-[5px] h-[3px] ml-2"})]}),t(F,{columns:[o],visible:h,onClose:()=>{p(!1)},value:u,onConfirm:e=>{m([o.find(s=>s.value===e[0]).label])}}),t(v,{placeholder:"\u8BF7\u8F93\u5165\u624B\u673A\u53F7\u7801",className:a.input})]})})})]})]})}export{te as default};