import{r as t,U as l}from"./index.5670e6e0.js";const f=()=>{const[u,c]=t.exports.useState([]),[p,r]=t.exports.useState([]),A=async()=>{var n,o,i,s,d,g;const a=await l.getRegionAndArea();(a==null?void 0:a.status)===200&&((o=(n=a==null?void 0:a.data)==null?void 0:n.region)==null||o.map(e=>{e.label=e.name,e.value=e.id,e.key=e.id}),(s=(i=a==null?void 0:a.data)==null?void 0:i.area)==null||s.map(e=>{e.label=e.name,e.value=e.id,e.key=e.id}),c((d=a==null?void 0:a.data)==null?void 0:d.region),r((g=a==null?void 0:a.data)==null?void 0:g.area))};return t.exports.useEffect(()=>{A()},[]),{region:u,area:p}};export{f as u};