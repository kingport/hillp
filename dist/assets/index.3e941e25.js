/* empty css                    */import{w as z,b as p,r as s,m as V,g as y,X as Z,R as g,Y as ee,J as te,G as re,j as ne,N as H,h as oe}from"./index.5670e6e0.js";import{d as U}from"./dev-log.6e115cc9.js";import{u as ie}from"./use-gesture-react.esm.346ddc85.js";import{b as E}from"./bound.bddb6539.js";const X=a=>z(a,p("div",{className:"adm-swiper-item",onClick:a.onClick,children:a.children})),w="adm-page-indicator",se={color:"primary",direction:"horizontal"},ae=s.exports.memo(a=>{const o=V(se,a),t=[];for(let c=0;c<o.total;c++)t.push(p("div",{className:y(`${w}-dot`,{[`${w}-dot-active`]:o.current===c})},c));return z(o,p("div",{className:y(w,`${w}-${o.direction}`,`${w}-color-${o.color}`),children:t}))}),ce=ae;function le(a){const[o,t]=s.exports.useState(a),c=s.exports.useRef(o);return s.exports.useEffect(()=>{c.current=o},[o]),[o,t,c]}const u="adm-swiper",de={defaultIndex:0,allowTouchMove:!0,autoplay:!1,autoplayInterval:3e3,loop:!1,direction:"horizontal",slideSize:100,trackOffset:0,stuckAtBoundary:!0,rubberband:!0};let k;const ue=s.exports.forwardRef(Z((a,o)=>{const t=V(de,a),[c]=s.exports.useState({}),f=t.direction==="vertical",$=t.slideSize/100,j=t.trackOffset/100,{validChildren:I,count:i}=s.exports.useMemo(()=>{let l=0;return{validChildren:g.Children.map(t.children,m=>g.isValidElement(m)?m.type!==X?(U("Swiper","The children of `Swiper` must be `Swiper.Item` components."),null):(l++,m):null),count:l}},[t.children]);return i===0||!I?(U("Swiper","`Swiper` needs at least one child."),null):()=>{let l=t.loop;$*(i-1)<1&&(l=!1);const C=s.exports.useRef(null);function m(){const e=C.current;return e?(f?e.offsetHeight:e.offsetWidth)*t.slideSize/100:0}const[x,G]=s.exports.useState(t.defaultIndex);ee(()=>{var e;(e=t.onIndexChange)===null||e===void 0||e.call(t,x)},[x]);const[O,W,N]=le(!1);function S(e){let r=0,n=i-1;return t.stuckAtBoundary&&(r+=j/$,n-=(1-$-j)/$),E(e,r,n)}const[{position:h},R]=te(()=>({position:S(x)*100,config:{tension:200,friction:30},onRest:()=>{if(N.current||!l)return;const e=h.get(),r=100*i,n=T(e,r);n!==e&&R.start({position:n,immediate:!0})}}),[i]),M=s.exports.useRef(null);function J(){var e;(e=M.current)===null||e===void 0||e.call(M),N.current=!1}const L=ie(e=>{if(M.current=e.cancel,!e.intentional||(e.first&&!k&&(k=c),k!==c))return;k=e.last?void 0:c;const r=m();if(!r)return;const n=f?1:0,d=e.offset[n],P=e.direction[n],b=e.velocity[n];if(W(!0),!e.last)R.start({position:d*100/r,immediate:!0});else{const _=Math.floor(d/r),K=_+1,Q=Math.round((d+b*2e3*P)/r);v(E(Q,_,K)),window.setTimeout(()=>{W(!1)})}},{transform:([e,r])=>[-e,-r],from:()=>{const e=m();return[h.get()/100*e,h.get()/100*e]},triggerAllEvents:!0,bounds:()=>{if(l)return{};const e=m(),r=S(0)*e,n=S(i-1)*e;return f?{top:r,bottom:n}:{left:r,right:n}},rubberband:t.rubberband,axis:f?"y":"x",preventScroll:!f,pointer:{touch:!0}});function v(e,r=!1){const n=Math.round(e),d=l?T(n,i):E(n,0,i-1);G(d),R.start({position:(l?n:S(n))*100,immediate:r})}function B(){v(Math.round(h.get()/100)+1)}function Y(){v(Math.round(h.get()/100)-1)}s.exports.useImperativeHandle(o,()=>({swipeTo:v,swipeNext:B,swipePrev:Y})),re(()=>{const e=I.length-1;x>e&&v(e,!0)});const{autoplay:A,autoplayInterval:D}=t;s.exports.useEffect(()=>{if(!A||O)return;const e=window.setInterval(()=>{B()},D);return()=>{window.clearInterval(e)}},[A,D,O,i]);function q(){return l?p("div",{className:`${u}-track-inner`,children:g.Children.map(I,(e,r)=>g.createElement(H.div,{className:`${u}-slide`,style:{[f?"y":"x"]:h.to(n=>{let d=-n+r*100;const P=i*100,b=P/2;return d=T(d+b,P)-b,`${d}%`}),[f?"top":"left"]:`-${r*100}%`}},e))}):g.createElement(H.div,{className:`${u}-track-inner`,style:{[f?"y":"x"]:h.to(e=>`${-e}%`)}},g.Children.map(I,e=>p("div",{className:`${u}-slide`,children:e})))}const F={"--slide-size":`${t.slideSize}%`,"--track-offset":`${t.trackOffset}%`};return z(t,ne("div",{className:y(u,`${u}-${t.direction}`),style:F,children:[p("div",{...Object.assign({ref:C,className:y(`${u}-track`,{[`${u}-track-allow-touch-move`]:t.allowTouchMove}),onClickCapture:e=>{N.current&&e.stopPropagation(),J()}},t.allowTouchMove?L():{}),children:q()}),t.indicator===void 0?p("div",{className:`${u}-indicator`,children:p(ce,{...Object.assign({},t.indicatorProps,{total:i,current:x,direction:t.direction})})}):t.indicator(i,x)]}))}}));function T(a,o){const t=a%o;return t<0?t+o:t}const ge=oe(ue,{Item:X});export{ge as S};
