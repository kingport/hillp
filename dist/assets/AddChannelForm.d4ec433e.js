import{r as c,u as Z,s as v,i as ee,k as M,b as t,_ as te,j as u,B as R,S as ae,F as ie,aG as ne,T as se,aD as re}from"./index.5670e6e0.js";import{F as r}from"./index.11c9b67d.js";import{I as b}from"./index.66fe089c.js";import{P as le}from"./index.77a6b2f7.js";import{A as oe}from"./index.ce6214e9.js";import{p as ce}from"./pickBy.15fa557e.js";import{D as ue}from"./dropdown.706ec38f.js";import{H as me}from"./index.04556cd2.js";import{s as m}from"./index.module.dd4ec762.js";import{S as de}from"./index.73a4613c.js";import{T as V}from"./TimePriceItem.1fe90ca6.js";import{E as H}from"./index.1c39e7a0.js";import{U as pe}from"./upload.3b886abe.js";import{u as he}from"./index.5733fb44.js";import{I as fe}from"./information.c9048f81.js";import{M as g}from"./manage.653bb3f0.js";/* empty css                    *//* empty css                 */import"./is-node-with-content.f661b98b.js";import"./interopRequireDefault.fc5525a1.js";import"./dev-log.6e115cc9.js";import"./index.31244c45.js";import"./index.cb878f88.js";import"./convert-px.daab3cc2.js";import"./CloseCircleFill.55d4b485.js";import"./bound.bddb6539.js";import"./index.c6660251.js";import"./use-gesture-react.esm.346ddc85.js";import"./rubberband.c88fa690.js";import"./PurePanel.2a417db7.js";import"./index.42a6e0fb.js";import"./index.92e459fd.js";import"./collapse.e34cf270.js";import"./useFlexGapSupport.172cfcf4.js";import"./last.7ecc4488.js";function Ye(){var O,P;const E=c.exports.useRef(null),[f]=r.useForm(),I=Z(),{area:h}=v.getState().global.areaRegion,n=ee(),x=(O=n==null?void 0:n.state)==null?void 0:O.id,y=he(document.querySelector("body")),[G,S]=c.exports.useState(!1),[_,N]=c.exports.useState([h[0].label]),[d,B]=c.exports.useState("$"),[o,w]=c.exports.useState({file_path:"",file_url:""}),[C,$]=c.exports.useState(),[A,D]=c.exports.useState(),[j,J]=c.exports.useState([]),{loading:z}=M(()=>fe.getInformationList({type:9}),{onSuccess(e){Q(e==null?void 0:e.data)}}),{data:s,run:K}=M(()=>{var e;return g.getChannelDetail({id:(e=n==null?void 0:n.state)==null?void 0:e.id})},{manual:!0,onSuccess:e=>{var a,l;f.setFieldsValue({...e.data}),N([(a=h.find(F=>{var k;return F.label===((k=e==null?void 0:e.data)==null?void 0:k.channel_area)}))==null?void 0:a.name]),e.data.cost_type===1&&B("%"),e.data.cost_type===2&&($(e.data.cost.eat_in),D(e.data.cost.take_out)),w({file_url:(l=e==null?void 0:e.data)==null?void 0:l.channel_head,file_path:""})}}),Q=(e=[])=>{e.map(a=>{a.value=a.remark,a.label=a.name}),J(e)};c.exports.useEffect(()=>{var e;(e=n==null?void 0:n.state)!=null&&e.id&&K()},[(P=n==null?void 0:n.state)==null?void 0:P.id]);const W=async()=>{await f.validateFields().then(async e=>{var F,k,q,T,U;_&&(e.channel_area=(F=h.find(i=>i.name===_[0]))==null?void 0:F.label),o!=null&&o.file_path&&(e.channel_head=o==null?void 0:o.file_path);const a=[];if(C&&d==="$"){let i={};Object.keys(C).map(p=>{i={price:e.eat_in[`price_${p}`],time:e.eat_in[`time_${p}`][0]},a.push(i)})}const l=[];if(A&&d==="$"){let i={};Object.keys(A).map(p=>{i={price:e.take_out[`price_${p}`],time:e.take_out[`time_${p}`][0]},l.push(i)})}if(d==="$"?(e.cost_type=2,e.cost=JSON.stringify({eat_in:a,take_out:l}),delete e.eat_in,delete e.take_out):e.cost_type=1,e=ce(e,re),((k=s==null?void 0:s.data)==null?void 0:k.cost)!==(e==null?void 0:e.cost)&&((q=s==null?void 0:s.data)==null?void 0:q.type)===3)ne.show({content:u("div",{className:"font-600 text-center pb-2 text-xl",children:[t("p",{children:"\u7B7E\u7EA6\u6E20\u9053\u66F4\u6539\u6210\u672C\u9700\u5BF9\u65B9\u540C\u610F"}),t("p",{children:"\u662F\u5426\u786E\u8BA4\u66F4\u6539"})]}),closeOnAction:!0,actions:[[{key:"cancel",text:"\u53D6\u6D88",className:"dialog-cancel",onClick(){}},{key:"confirm",text:"\u786E\u8BA4",className:"dialog-confirm",async onClick(){var p,L;let i;x?(e.type=(p=s==null?void 0:s.data)==null?void 0:p.type,e.id=(L=n.state)==null?void 0:L.id,i=await g.editChannel({...e})):i=await g.addChannel({...e}),i.status===200&&I("/manage/channel/list")}}]]});else{let i;x?(e.type=(T=s==null?void 0:s.data)==null?void 0:T.type,e.id=(U=n.state)==null?void 0:U.id,i=await g.editChannel({...e})):i=await g.addChannel({...e}),i.status===200&&I("/manage/channel/list")}})},X=async e=>{const a=[...e.target.files];if(a.length){const l=await pe.uploadFile(a);(l==null?void 0:l.status)===200&&(se.show(l.data.msg),w(l.data.data))}},Y=e=>{e!=null&&e.key&&N([h.find(a=>Number(a.value)===Number(e==null?void 0:e.key)).label])};return z?t(te,{color:"primary"}):u("div",{className:`${m.AddEmployeeForm} pt-[48px] pb-[90px] bg-[#fff] sm:p-0 sm:flex sm:justify-center !sm:min-h-[calc(100vh-60px)]`,children:[t(me,{renderRight:!1,title:"\u586B\u5199\u6E20\u9053\u8D44\u6599",border:!0}),t("div",{className:"flex flex-col px-10 py-12 sm:w-500px",children:u(r,{form:f,requiredMarkStyle:"none",layout:"horizontal",footer:null,children:[u("div",{className:"flex items-center",children:[t(oe,{style:{"--border-radius":"50%","--size":"80px"},className:"mr-5",src:o==null?void 0:o.file_url}),t(R,{loading:"auto",onClick:async()=>{await E.current.click()},className:"bg-[#f3f3f3] border-0",shape:"rounded",loadingIcon:t(H,{}),children:"\u4E0A\u4F20\u5934\u50CF"}),t("input",{id:"file",type:"file",ref:E,accept:".jpg,.jpeg,.png",hidden:!0,onChange:e=>X(e)})]}),t("p",{className:"pt-12 pb-4",children:"\u57FA\u672C\u8D44\u6599"}),t(r.Item,{name:"channel_name",label:"\u6E20\u9053\u540D\u79F0",rules:[{required:!0}],children:t(b,{placeholder:"\u6E20\u9053\u540D\u79F0"})}),t(r.Item,{name:"channel_email",label:"\u6E20\u9053\u90AE\u7BB1",rules:[{required:!0}],children:t(b,{placeholder:"\u90AE\u7BB1"})}),t(r.Item,{label:"\u6E20\u9053\u624B\u673A",children:u("div",{className:m.phone,children:[u("div",{onClick:()=>{(y==null?void 0:y.width)&&(y==null?void 0:y.width)<=640&&S(!0)},className:`${m.phoneCode} text-xs h-full pl-3 pr-2 flex items-center justify-center`,children:[t("p",{className:"min-w-30px sm:hidden",children:_}),t(ue,{menu:{items:h,onClick:Y},className:"<sm:hidden min-w-40px text-center",children:t("a",{onClick:e=>e.preventDefault(),children:_})}),t(ae,{name:"phone-bottom",className:"w-[5px] h-[3px]"})]}),t(le,{columns:[h],visible:G,onClose:()=>{S(!1)},value:_,onConfirm:e=>{N([h.find(a=>a.value===e[0]).label])}}),t(r.Item,{noStyle:!0,name:"channel_phone",rules:[{required:!0}],children:t(b,{placeholder:"\u8BF7\u8F93\u5165\u624B\u673A\u53F7\u7801",className:m.input})})]})}),t("div",{className:"border-b my-8"}),t(r.Item,{label:"\u6210\u672C",children:u("div",{className:"flex items-center",children:[u("div",{className:`${m.cost} flex items-center mr-2`,children:[t("span",{className:"text-xs pl-3 w-6 flex items-center justify-center",children:d}),d==="$"&&t(r.Item,{noStyle:!0,rules:[{required:!1}],children:t(b,{disabled:!0,placeholder:"0.00",className:`${m.input}`})}),d!=="$"&&t(r.Item,{noStyle:!0,name:"cost",rules:[{required:!0}],children:t(b,{placeholder:"0.00",className:`${m.input}`})})]}),t(de,{valueUnit:d,changeConfirm:e=>{B(e),f.setFieldsValue({cost:""})},leftUnit:"%",rightUnit:"$"})]})}),d==="$"&&u(ie,{children:[t(r.Item,{className:`${m.dineIn} mt-4`,name:"eat_in",label:"\u5802\u98DF",children:t(V,{isEdit:x,timePicker:j,list:C,setList:$,keyTitle:"eat_in",form:f})}),t(r.Item,{className:`${m.takeOut}`,name:"take_out",label:"\u5916\u5356",children:t(V,{isEdit:x,timePicker:j,list:A,setList:D,keyTitle:"take_out",form:f})})]}),t("div",{className:"border-b my-8"}),t(r.Item,{layout:"vertical",name:"address",label:"\u5730\u5740\uFF08\u9009\u586B\uFF09",children:t(b,{placeholder:"\u5DE5\u4F5C\u5730\u70B9"})}),t("div",{className:"<sm:fixed-b-btn flex sm:mt-5",children:t(R,{onClick:W,className:"w-[70%] h-[2.75rem] rounded-xl sm:w-120px sm:rounded-3xl",block:!0,type:"submit",color:"primary",loading:"auto",loadingIcon:t(H,{}),children:x?"\u66F4\u65B0":" \u6DFB\u52A0"})})]})})]})}export{Ye as default};
