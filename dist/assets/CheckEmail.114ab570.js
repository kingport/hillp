import{F as r}from"./index.11c9b67d.js";import{I as E}from"./index.66fe089c.js";import{i as v,u as N,j as o,b as s,B as C,U as g,T as B}from"./index.5670e6e0.js";import{s as F}from"./index.module.491ae085.js";import{E as k}from"./index.1c39e7a0.js";import{H as j}from"./index.04556cd2.js";/* empty css                    */import"./is-node-with-content.f661b98b.js";import"./interopRequireDefault.fc5525a1.js";import"./dev-log.6e115cc9.js";import"./index.31244c45.js";import"./index.cb878f88.js";import"./convert-px.daab3cc2.js";import"./CloseCircleFill.55d4b485.js";import"./bound.bddb6539.js";/* empty css                 */function J(){var n,u,d;const e=v(),b=N(),[i]=r.useForm(),l=((n=e.state)==null?void 0:n.account)==="merchant",c=((u=e.state)==null?void 0:u.account)==="personal",w=async()=>{await(i==null?void 0:i.validateFields().then(async m=>{var p,f,h,x;let t;l&&(t=2),c&&(t=1);const a=await g.checkEmailCode({email:(p=e==null?void 0:e.state)==null?void 0:p.email,user_type:t,...m});a.status===201&&b("/user/register/account",{state:{account:(f=e.state)==null?void 0:f.account,email:(h=e==null?void 0:e.state)==null?void 0:h.email,register_code:(x=a==null?void 0:a.data)==null?void 0:x.register_code}})}))},y=async()=>{var a;let m;l&&(m=2),c&&(m=1);const t=await g.getEmailCode({email:(a=e==null?void 0:e.state)==null?void 0:a.email,user_type:m});(t==null?void 0:t.status)===200&&B.show({content:t==null?void 0:t.msg,duration:1e3})};return o("div",{className:`${F.register} px-8 pt-10 flex justify-center items-center`,children:[s(j,{renderRight:!1}),s("div",{className:"shadow-sm bg-[#fff] flex flex-col items-center rounded-md mt-14 py-8 w-full sm:w-[600px]",children:o(r,{form:i,className:"w-[90%]",requiredMarkStyle:"none",footer:s(C,{onClick:w,size:"large",block:!0,color:"primary",loading:"auto",loadingIcon:s(k,{}),children:"\u4E0B\u4E00\u6B65"}),children:[o("div",{className:"flex items-center justify-between",children:[s("p",{className:"text-xs",children:(d=e==null?void 0:e.state)==null?void 0:d.email}),s("p",{onClick:y,className:"text-xs",children:"\u91CD\u65B0\u53D1\u9001"})]}),s(r.Item,{name:"vcode",rules:[{required:!0}],children:s(E,{placeholder:"\u8BF7\u8F93\u5165\u90AE\u7BB1\u9A8C\u8BC1\u7801"})})]})}),s("div",{className:"hidden sm:flex sm:absolute sm:top-32 sm:-left-13.5 sm:w-167px sm:h-167px sm:rounded-full sm:bg-[#D2693F]"}),s("div",{className:"hidden sm:flex sm:opacity-50 sm:absolute sm:top-51.25 sm:-left-10.5 sm:w-107px sm:h-107px sm:rounded-full sm:bg-[#C8E3E2]"}),s("div",{className:"hidden sm:flex sm:absolute sm:-right-10 sm:-bottom-10 sm:w-241px sm:h-241px sm:rounded-full sm:bg-[#2A4948]"}),s("div",{className:"hidden sm:flex sm:opacity-50 sm:absolute sm:bottom-20 sm:-right-10.5 sm:w-107px sm:h-107px sm:rounded-full sm:bg-[#C8E3E2]"})]})}export{J as default};
