import{u as R,i as V,R as x,r as L,k as M,j as o,b as t,S as u,F as T,B as $,T as H,U,aD as Z}from"./index.5670e6e0.js";import{F as i}from"./index.11c9b67d.js";import{C as G}from"./index.88567fed.js";import{I as c}from"./index.66fe089c.js";import{P as _}from"./index.77a6b2f7.js";import{p as J}from"./pickBy.15fa557e.js";import{D as K}from"./dropdown.706ec38f.js";import{S as O}from"./index.0a2bddee.js";import{s as l}from"./index.module.491ae085.js";import{u as Q}from"./useRegionArea.dccea8fa.js";import{E as W}from"./index.1c39e7a0.js";import{u as X}from"./index.5733fb44.js";/* empty css                    *//* empty css                 */import"./is-node-with-content.f661b98b.js";import"./interopRequireDefault.fc5525a1.js";import"./dev-log.6e115cc9.js";import"./index.31244c45.js";import"./index.cb878f88.js";import"./convert-px.daab3cc2.js";import"./native-input.0c0515ca.js";import"./CloseCircleFill.55d4b485.js";import"./bound.bddb6539.js";import"./index.c6660251.js";import"./use-gesture-react.esm.346ddc85.js";import"./rubberband.c88fa690.js";import"./PurePanel.2a417db7.js";import"./index.42a6e0fb.js";import"./index.92e459fd.js";import"./collapse.e34cf270.js";import"./useFlexGapSupport.172cfcf4.js";import"./statusUtils.6dc02607.js";import"./DownOutlined.9a14fa90.js";import"./SearchOutlined.a0283b8c.js";function Se(){var N,C,y,E,A;const F=R(),m=V(),d=((N=m.state)==null?void 0:N.account)==="merchant",D=((C=m.state)==null?void 0:C.account)==="personal",I=(y=m.state)==null?void 0:y.type,s=X(document.querySelector("body")),[p]=i.useForm(),P=(E=m.state)==null?void 0:E.register_code,{area:n,region:B}=Q(),[b,w]=x.useState(!1),[S,g]=x.useState(!1),[h,f]=x.useState([""]);L.exports.useEffect(()=>{var e;f([(e=n[0])==null?void 0:e.name])},[n]);const v=async()=>{await(p==null?void 0:p.validateFields().then(async e=>{var r;h&&(e.area_id=(r=n.find(a=>a.name===h[0]))==null?void 0:r.id),e.region_id=e.region_id[0],e.register_code=P,e=J(e,Z),j(e)}))},{run:j}=M(e=>U.getPhoneCode({phone:e==null?void 0:e.phone,area_id:e==null?void 0:e.area_id,user_type:d?2:1,register_code:e==null?void 0:e.register_code}),{manual:!0,onSuccess:(e,r)=>{H.show({content:e==null?void 0:e.msg,afterClose(){var a,k;F("/verification",{state:{account:(a=m.state)==null?void 0:a.account,email:(k=m.state)==null?void 0:k.email,formData:r[0],type:I}})}})}}),q=e=>{e!=null&&e.key&&f([n.find(r=>Number(r.value)===Number(e==null?void 0:e.key)).label])};return o("div",{className:`${l.register} px-8 py-8 sm:min-h-[100vh] sm:flex sm:justify-center sm:items-center`,children:[o("div",{className:"sm:w-[500px] sm:flex sm:flex-col sm:justify-center",children:[o("div",{className:"flex items-center justify-between",children:[t(u,{onClick:()=>F(-1),name:"user-left",className:"w-6.5 h-3 ml-2 cursor-pointer"}),t(u,{name:"logo",className:"w-21 h-5 -ml-6.5"}),t("div",{})]}),o("div",{className:"shadow-sm bg-[#fff] flex flex-col items-center rounded-md mt-14 py-8",children:[o("p",{className:"text-center text-color-[#2A4948] text-xl font-600",children:[d&&"\u521B\u5EFA\u60A8\u7684\u5546\u5BB6\u8D26\u53F7",D&&"\u521B\u5EFA\u60A8\u7684\u4E2A\u4EBA\u8D26\u53F7"]}),d&&o(T,{children:[t("p",{className:"text-xs text-color-[#B0B0B0] pt-4",children:"\u8BF7\u5E2E\u60A8\u7684\u65B0\u5E10\u6237"}),o("p",{className:"text-xs text-color-[#B0B0B0] pb-8",children:[(A=m.state)==null?void 0:A.email,"\u586B\u5199\u4EE5\u4E0B\u4FE1\u606F"]})]}),o(i,{form:p,className:"w-[90%]",requiredMarkStyle:"none",footer:t($,{onClick:v,block:!0,color:"primary",loading:"auto",loadingIcon:t(W,{}),children:"\u521B\u5EFA"}),children:[t(i.Item,{name:"name",label:"\u59D3\u540D",rules:[{required:!0}],children:t(c,{placeholder:"\u8BF7\u8F93\u5165\u59D3\u540D"})}),t(i.Item,{name:"password",label:"\u5BC6\u7801",rules:[{required:!0,validator(e,r){return/^(?=.*[A-Z])(?=.*[a-z])[A-Za-z0-9]{8,}$/.test(r)?Promise.resolve():Promise.reject("\u5BC6\u7801\u5305\u542B\u5927\u5C0F\u5199\u548C\u6570\u5B57\uFF0C\u4E14\u957F\u5EA6\u4E0D\u5C0F\u4E8E8")}}],children:o("div",{className:l.password,children:[t(c,{placeholder:"\u8BF7\u8F93\u5165\u5BC6\u7801",className:l.input,type:b?"text":"password"}),t("div",{className:l.eye,children:b?t(u,{name:"hide-eyes",className:"w-[12px] h-[12px]",onClick:()=>w(!1)}):t(u,{name:"eyes",className:"w-[12px] h-[12px]",onClick:()=>w(!0)})})]})}),t(i.Item,{name:"phone",label:"\u624B\u673A\u53F7\u7801",rules:[{required:!0}],children:o("div",{className:l.phone,children:[o("div",{onClick:()=>{(s==null?void 0:s.width)&&(s==null?void 0:s.width)<=640&&g(!0)},className:`${l.phoneCode} text-xs h-full flex items-center justify-center`,children:[t("p",{className:"min-w-30px pl-1 sm:hidden",children:h}),t(K,{menu:{items:n,onClick:q},className:"<sm:hidden min-w-40px text-center",children:t("a",{onClick:e=>e.preventDefault(),children:h})}),t(u,{name:"phone-bottom",className:"w-[5px] h-[3px] mr-1"})]}),t(_,{columns:[n],visible:S,onClose:()=>{g(!1)},value:h,onConfirm:e=>{f([n.find(r=>r.value===e[0]).label])}}),t(c,{placeholder:"\u8BF7\u8F93\u5165\u624B\u673A\u53F7\u7801",className:l.input})]})}),d&&t(i.Item,{name:"store_name",label:"\u5546\u5BB6\u540D\u79F0",children:t(c,{placeholder:"\u8BF7\u8F93\u5165\u5546\u5BB6\u540D\u79F0"})}),t(i.Item,{name:"region_id",label:"\u5730\u533A",trigger:"onConfirm",onClick:(e,r)=>{var a;if((s==null?void 0:s.width)&&(s==null?void 0:s.width)>640)return!1;(a=r.current)==null||a.open()},layout:"vertical",rules:[{required:!0,message:"\u8BF7\u9009\u62E9\u5730\u533A"}],children:(s==null?void 0:s.width)&&(s==null?void 0:s.width)>640?t(O,{style:{width:"100%"},onChange:e=>{e&&p.setFieldsValue({region_id:[e]})},className:"!rounded-sm !bg-[#fff] <sm:hidden",options:B}):t(_,{columns:[B],children:e=>{var r;return t("span",{className:"text-xs border border-width-[0.7px] border-solid border-color-[#cbd2d1] min-h-8 rounded-md pl-3 flex items-center",children:((r=e[0])==null?void 0:r.label)||""})}})}),d&&t(i.Item,{name:"store_website",label:"\u5546\u5BB6\u7F51\u7AD9\uFF08\u9009\u586B\uFF09",children:t(c,{placeholder:"\u8BF7\u9009\u62E9"})}),t(i.Item,{name:"invite_code",label:"\u9080\u8BF7\u7801\uFF08\u9009\u586B\uFF09",children:t(c,{placeholder:"\u8BF7\u9009\u62E9"})}),t(i.Item,{children:t(G,{icon:e=>e?t(u,{name:"checked",className:"w-[12px] h-[12px] mt-[3px]"}):t(u,{name:"checked",className:"w-[12px] h-[12px] mt-[3px]"}),value:"1",children:o("span",{className:"text-xs text-color-[#707070]",children:["\u6211\u540C\u610F ",t("a",{href:"https://www.91uber.com/terms-and-conditions",children:"\u300AHIILP\u9690\u79C1\u6761\u6B3E\u300B"}),t("a",{href:"https://www.91uber.com/terms-and-conditions",children:"\u300AHIILP\u5546\u6237\u6761\u6B3E\u300B"})]})})})]})]})]}),t("div",{className:"hidden sm:flex sm:absolute sm:top-32 sm:-left-13.5 sm:w-167px sm:h-167px sm:rounded-full sm:bg-[#D2693F]"}),t("div",{className:"hidden sm:flex sm:opacity-50 sm:absolute sm:top-51.25 sm:-left-10.5 sm:w-107px sm:h-107px sm:rounded-full sm:bg-[#C8E3E2]"}),t("div",{className:"hidden sm:flex sm:absolute sm:-right-10 sm:-bottom-10 sm:w-241px sm:h-241px sm:rounded-full sm:bg-[#2A4948]"}),t("div",{className:"hidden sm:flex sm:opacity-50 sm:absolute sm:bottom-20 sm:-right-10.5 sm:w-107px sm:h-107px sm:rounded-full sm:bg-[#C8E3E2]"})]})}export{Se as default};