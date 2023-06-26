import{u as B,r,k as S,j as t,b as s,S as C,F as x,aI as A,Y as j}from"./index.5670e6e0.js";import{A as L}from"./index.ce6214e9.js";import{H as M}from"./index.04556cd2.js";import{S as D}from"./index.4b9ab638.js";import{M as w}from"./manage.653bb3f0.js";import{I}from"./index.0edfa0b7.js";import{S as _}from"./index.0a2bddee.js";import{u as E}from"./index.983b0d64.js";/* empty css                    *//* empty css                 */import"./index.77a6b2f7.js";import"./index.c6660251.js";import"./use-gesture-react.esm.346ddc85.js";import"./rubberband.c88fa690.js";import"./bound.bddb6539.js";import"./index.a450b78e.js";import"./statusUtils.6dc02607.js";import"./SearchOutlined.a0283b8c.js";import"./index.42a6e0fb.js";import"./PurePanel.2a417db7.js";import"./DownOutlined.9a14fa90.js";const k={},{Search:F}=I,H=()=>{const n=B(),[i,l,g]=E(1),[d,m,f]=E(""),[y,o]=r.exports.useState([]),[b,c]=r.exports.useState(!0),[p,v]=r.exports.useState("0"),h=e=>{const u=(e==null?void 0:e.type)===1?"\u72EC\u5BB6":e.type===2?"\u5173\u8054":e.type===3?"\u7B7E\u7EA6":"";return t("div",{className:"flex items-center justify-between border rounded-md border-color-[#e9e9e9] py-2 border-solid",children:[t("div",{onClick:()=>{n("/manage/channel/info",{state:{id:e.id}})},className:"flex w-[33%] h-12 items-center",children:[s(L,{src:e==null?void 0:e.channel_head,className:"mr-2 ml-4",style:{"--border-radius":"50%","--size":"20px"}}),s("p",{className:"text-xs text-color-[#2A4948] opacity-80",children:e.channel_name})]}),t("div",{className:"flex justify-center pl-4 w-[33%] h-12 flex-col text-xs",children:[s("p",{children:e==null?void 0:e.channel_phone}),s("p",{children:e==null?void 0:e.channel_email})]}),s("div",{className:"flex w-[33%] h-12 items-center flex-grow justify-center text-xs",children:s("p",{children:u})})]},e.id)},{runAsync:N}=S(e=>w.getChannelList(e),{manual:!0}),a=async()=>{const e=await N({page:i,keyword:d,type:p});l(u=>u+1),o(u=>[...u,...e.data.data]),c(e.data.data.length>0)};return r.exports.useEffect(()=>{l(1),o([]),c(!0)},[d]),t("div",{className:"flex flex-col w-556px min-h-[calc(100vh-60px)] mt-20 overflow-auto <sm:hidden",children:[t("div",{className:"flex justify-between",children:[s("p",{className:"text-2xl font-600",children:"\u7BA1\u7406\u6E20\u9053"}),t("div",{onClick:()=>n("/manage/add/channel"),className:"flex bg-[#fff] shadow-sm rounded-md items-center px-4 py-3 cursor-pointer hover:opacity-90",children:[s(C,{name:"add",className:"w-[11px] h-[11px]"}),s("span",{className:"text-xs pl-1",children:"\u6DFB\u52A0\u65B0\u6E20\u9053"})]})]}),t("div",{className:"flex items-center px-6 py-4 justify-between mt-5 bg-[#f4f6f6] rounded-md",children:[s("div",{children:s(F,{placeholder:"\u59D3\u540D\u6216\u90AE\u7BB1\u641C\u7D22",onSearch:e=>{m(e),l(1),o([]),c(!0)}})}),s(_,{style:{width:"auto"},onChange:e=>{l(1),o([]),c(!0),v(e)},defaultValue:"0",options:[{value:"0",label:"\u5168\u90E8"},{value:"1",label:"\u72EC\u5BB6"},{value:"2",label:"\u5173\u8054"},{value:"3",label:"\u7B7E\u7EA6"}]})]}),t("div",{className:"h-[90vh] overflow-auto mt-1",children:[s(x,{children:y.map(e=>h(e))}),s(A,{loadMore:a,hasMore:b})]})]})};function re(){const n=B(),i="\u6E20\u9053";S(()=>w.getChannelSelect({}),{onSuccess(a){a.data.map(e=>{e.label=e.channel_name,e.value=e.id}),c(a.data)}});const l=async(a=1)=>await w.getChannelList({page:a,id:p}),[g,d]=r.exports.useState(1),[m,f]=r.exports.useState([]),[y,o]=r.exports.useState(!0),[b,c]=r.exports.useState([]),[p,v]=r.exports.useState(0),h=async()=>{const a=await l(g);d(e=>e+1),f(e=>[...e,...a.data.data]),o(a.data.data.length>0)};j(()=>{h()},[p]);const N=a=>{const e=(a==null?void 0:a.type)===1?"\u72EC\u5BB6":a.type===2?"\u5173\u8054":a.type===3?"\u7B7E\u7EA6":"";return t("div",{className:"flex items-center justify-between border-color-[#e9e9e9] border-solid border-b-[0.5px]",children:[t("div",{onClick:()=>{n("/manage/channel/info",{state:{id:a.id}})},className:"flex w-[33%] h-12 items-center border-color-[#e9e9e9] border-solid border-r-[0.5px]",children:[s(L,{src:a==null?void 0:a.channel_head,className:"mr-2 ml-4",style:{"--border-radius":"50%","--size":"20px"}}),s("p",{className:"text-xs text-color-[#2A4948] opacity-80",children:a.channel_name})]}),t("div",{className:"flex justify-center pl-4 w-[33%] h-12 flex-col text-xs border-color-[#e9e9e9] border-solid border-r-[0.5px]",children:[s("p",{children:a==null?void 0:a.channel_phone}),s("p",{children:a==null?void 0:a.channel_email})]}),s("div",{className:"flex w-[33%] h-12 items-center flex-grow justify-center text-xs",children:s("p",{children:e})})]},a.id)};return t(x,{children:[t("div",{className:`${k.employeeList} pt-[48px] min-h-[100vh] bg-[#fff] sm:hidden`,children:[s(M,{title:`${i}\u5217\u8868`,onBack:()=>n("/manage"),renderLeft:!1}),s("div",{className:"shadow-sm py-8 sm:hidden",children:s(D,{onChange:a=>{d(1),f([]),v(a[0])},initValue:["0"],options:[[{label:"\u5168\u90E8\u6E20\u9053",value:"0"},...b]]})}),t("div",{className:"flex flex-col",children:[t("div",{className:"flex items-center text-sm",children:[s("p",{className:"w-[33%] text-center py-2 border-color-[#e9e9e9] border-solid border-r-[0.5px] border-b-[0.5px]",children:"\u6E20\u9053"}),s("p",{className:"w-[33%] text-center py-2 border-color-[#e9e9e9] border-solid border-r-[0.5px] border-b-[0.5px]",children:"\u8054\u7CFB\u65B9\u5F0F"}),s("p",{className:"w-[33%] text-center py-2 border-color-[#e9e9e9] border-solid border-b-[0.5px]",children:"\u72B6\u6001"})]}),t(x,{children:[s(x,{children:m.map((a,e)=>N(a))}),s(A,{loadMore:h,hasMore:y})]})]}),t("div",{onClick:()=>{n("/manage/add/channel")},className:"flex bg-[#fff] fixed z-10 left-8 bottom-30 flex-auto shadow-sm rounded-md items-center px-4 py-3",children:[s(C,{name:"add",className:"w-[11px] h-[11px]"}),t("span",{className:"text-xs pl-1",children:["\u6DFB\u52A0\u65B0",i]})]})]}),s("div",{className:"<sm(hidden)",children:s(H,{})})]})}export{re as default};