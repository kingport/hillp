import{a0 as r,j as y,b as l,S as b}from"./index.5670e6e0.js";function v(d){var o,i;const{val:e,innerHeight:h="21px",noIcon:p=!1,iconName:t="caret-down",iconWidth:x="10px",iconHeight:m="6px",style:f={},textType:a}=d,s=a==="normal"?e.every(n=>n===null)?"":e.map(n=>{var c;return(c=n==null?void 0:n.label)!=null?c:""})[0]:a==="time"?e.every(n=>n===null)?"":`${(o=e[0])==null?void 0:o.label}:${(i=e[1])==null?void 0:i.label}`:a==="date"&&r(e).isValid()?r(e).format("dddd YYYY/MM/DD"):"";return t?y("div",{className:"flex items-center justify-between",style:{height:h,...f},children:[l("span",{children:s}),!p&&l(b,{name:t,className:`w-[${x}] h-[${m}] ml-2 fill-[#2A4948]`})]}):l("span",{children:s})}export{v as P};