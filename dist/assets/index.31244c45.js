/* empty css                    */import{r as C,w as vt,b as R,R as ut,aN as Dt,m as Ft,p as Mt,L as $t,j as it,g as st,G as Vt,aO as Bt,F as Ht,Q as _t,aP as Wt,h as jt}from"./index.5670e6e0.js";import{u as zt}from"./index.cb878f88.js";import{c as K}from"./convert-px.daab3cc2.js";const It=C.exports.memo(t=>vt(t,R("svg",{viewBox:"0 0 30 16",children:R("g",{fill:"currentColor",children:R("path",{d:"M0,0 L30,0 L18.07289,14.312538 C16.65863,16.009645 14.13637,16.238942 12.43926,14.824685 C12.25341,14.669808 12.08199,14.49839 11.92711,14.312538 L0,0 L0,0 Z"})})})));function Y(t){return t.split("-")[1]}function lt(t){return t==="y"?"height":"width"}function N(t){return t.split("-")[0]}function j(t){return["top","bottom"].includes(N(t))?"x":"y"}function dt(t,e,n){let{reference:i,floating:s}=t;const o=i.x+i.width/2-s.width/2,r=i.y+i.height/2-s.height/2,c=j(e),l=lt(c),u=i[l]/2-s[l]/2,m=N(e),a=c==="x";let f;switch(m){case"top":f={x:o,y:i.y-s.height};break;case"bottom":f={x:o,y:i.y+i.height};break;case"right":f={x:i.x+i.width,y:r};break;case"left":f={x:i.x-s.width,y:r};break;default:f={x:i.x,y:i.y}}switch(Y(e)){case"start":f[c]-=u*(n&&a?-1:1);break;case"end":f[c]+=u*(n&&a?-1:1);break}return f}const Xt=async(t,e,n)=>{const{placement:i="bottom",strategy:s="absolute",middleware:o=[],platform:r}=n,c=o.filter(Boolean),l=await(r.isRTL==null?void 0:r.isRTL(e));let u=await r.getElementRects({reference:t,floating:e,strategy:s}),{x:m,y:a}=dt(u,i,l),f=i,p={},d=0;for(let h=0;h<c.length;h++){const{name:y,fn:x}=c[h],{x:w,y:g,data:b,reset:v}=await x({x:m,y:a,initialPlacement:i,placement:f,strategy:s,middlewareData:p,rects:u,platform:r,elements:{reference:t,floating:e}});if(m=w!=null?w:m,a=g!=null?g:a,p={...p,[y]:{...p[y],...b}},v&&d<=50){d++,typeof v=="object"&&(v.placement&&(f=v.placement),v.rects&&(u=v.rects===!0?await r.getElementRects({reference:t,floating:e,strategy:s}):v.rects),{x:m,y:a}=dt(u,f,l)),h=-1;continue}}return{x:m,y:a,placement:f,strategy:s,middlewareData:p}};function Ut(t){return{top:0,right:0,bottom:0,left:0,...t}}function bt(t){return typeof t!="number"?Ut(t):{top:t,right:t,bottom:t,left:t}}function Z(t){return{...t,top:t.y,left:t.x,right:t.x+t.width,bottom:t.y+t.height}}async function J(t,e){var n;e===void 0&&(e={});const{x:i,y:s,platform:o,rects:r,elements:c,strategy:l}=t,{boundary:u="clippingAncestors",rootBoundary:m="viewport",elementContext:a="floating",altBoundary:f=!1,padding:p=0}=e,d=bt(p),y=c[f?a==="floating"?"reference":"floating":a],x=Z(await o.getClippingRect({element:(n=await(o.isElement==null?void 0:o.isElement(y)))==null||n?y:y.contextElement||await(o.getDocumentElement==null?void 0:o.getDocumentElement(c.floating)),boundary:u,rootBoundary:m,strategy:l})),w=a==="floating"?{...r.floating,x:i,y:s}:r.reference,g=await(o.getOffsetParent==null?void 0:o.getOffsetParent(c.floating)),b=await(o.isElement==null?void 0:o.isElement(g))?await(o.getScale==null?void 0:o.getScale(g))||{x:1,y:1}:{x:1,y:1},v=Z(o.convertOffsetParentRelativeRectToViewportRelativeRect?await o.convertOffsetParentRelativeRectToViewportRelativeRect({rect:w,offsetParent:g,strategy:l}):w);return{top:(x.top-v.top+d.top)/b.y,bottom:(v.bottom-x.bottom+d.bottom)/b.y,left:(x.left-v.left+d.left)/b.x,right:(v.right-x.right+d.right)/b.x}}const Yt=Math.min,qt=Math.max;function rt(t,e,n){return qt(t,Yt(e,n))}const Gt=t=>({name:"arrow",options:t,async fn(e){const{element:n,padding:i=0}=t||{},{x:s,y:o,placement:r,rects:c,platform:l}=e;if(n==null)return{};const u=bt(i),m={x:s,y:o},a=j(r),f=lt(a),p=await l.getDimensions(n),d=a==="y"?"top":"left",h=a==="y"?"bottom":"right",y=c.reference[f]+c.reference[a]-m[a]-c.floating[f],x=m[a]-c.reference[a],w=await(l.getOffsetParent==null?void 0:l.getOffsetParent(n));let g=w?a==="y"?w.clientHeight||0:w.clientWidth||0:0;g===0&&(g=c.floating[f]);const b=y/2-x/2,v=u[d],O=g-p[f]-u[h],A=g/2-p[f]/2+b,S=rt(v,A,O),P=Y(r)!=null&&A!=S&&c.reference[f]/2-(A<v?u[d]:u[h])-p[f]/2<0?A<v?v-A:O-A:0;return{[a]:m[a]-P,data:{[a]:S,centerOffset:A-S}}}}),Kt=["top","right","bottom","left"],Qt={left:"right",right:"left",bottom:"top",top:"bottom"};function tt(t){return t.replace(/left|right|bottom|top/g,e=>Qt[e])}function Zt(t,e,n){n===void 0&&(n=!1);const i=Y(t),s=j(t),o=lt(s);let r=s==="x"?i===(n?"end":"start")?"right":"left":i==="start"?"bottom":"top";return e.reference[o]>e.floating[o]&&(r=tt(r)),{main:r,cross:tt(r)}}const Jt={start:"end",end:"start"};function ct(t){return t.replace(/start|end/g,e=>Jt[e])}function te(t){const e=tt(t);return[ct(t),e,ct(e)]}function ee(t,e,n){const i=["left","right"],s=["right","left"],o=["top","bottom"],r=["bottom","top"];switch(t){case"top":case"bottom":return n?e?s:i:e?i:s;case"left":case"right":return e?o:r;default:return[]}}function ne(t,e,n,i){const s=Y(t);let o=ee(N(t),n==="start",i);return s&&(o=o.map(r=>r+"-"+s),e&&(o=o.concat(o.map(ct)))),o}const oe=function(t){return t===void 0&&(t={}),{name:"flip",options:t,async fn(e){var n;const{placement:i,middlewareData:s,rects:o,initialPlacement:r,platform:c,elements:l}=e,{mainAxis:u=!0,crossAxis:m=!0,fallbackPlacements:a,fallbackStrategy:f="bestFit",fallbackAxisSideDirection:p="none",flipAlignment:d=!0,...h}=t,y=N(i),x=N(r)===r,w=await(c.isRTL==null?void 0:c.isRTL(l.floating)),g=a||(x||!d?[tt(r)]:te(r));!a&&p!=="none"&&g.push(...ne(r,d,p,w));const b=[r,...g],v=await J(e,h),O=[];let A=((n=s.flip)==null?void 0:n.overflows)||[];if(u&&O.push(v[y]),m){const{main:P,cross:M}=Zt(i,o,w);O.push(v[P],v[M])}if(A=[...A,{placement:i,overflows:O}],!O.every(P=>P<=0)){var S;const P=(((S=s.flip)==null?void 0:S.index)||0)+1,M=b[P];if(M)return{data:{index:P,overflows:A},reset:{placement:M}};let $="bottom";switch(f){case"bestFit":{var _;const q=(_=A.map(G=>[G,G.overflows.filter(z=>z>0).reduce((z,Nt)=>z+Nt,0)]).sort((G,z)=>G[1]-z[1])[0])==null?void 0:_[0].placement;q&&($=q);break}case"initialPlacement":$=r;break}if(i!==$)return{reset:{placement:$}}}return{}}}};function mt(t,e){return{top:t.top-e.height,right:t.right-e.width,bottom:t.bottom-e.height,left:t.left-e.width}}function pt(t){return Kt.some(e=>t[e]>=0)}const ie=function(t){return t===void 0&&(t={}),{name:"hide",options:t,async fn(e){const{strategy:n="referenceHidden",...i}=t,{rects:s}=e;switch(n){case"referenceHidden":{const o=await J(e,{...i,elementContext:"reference"}),r=mt(o,s.reference);return{data:{referenceHiddenOffsets:r,referenceHidden:pt(r)}}}case"escaped":{const o=await J(e,{...i,altBoundary:!0}),r=mt(o,s.floating);return{data:{escapedOffsets:r,escaped:pt(r)}}}default:return{}}}}};async function se(t,e){const{placement:n,platform:i,elements:s}=t,o=await(i.isRTL==null?void 0:i.isRTL(s.floating)),r=N(n),c=Y(n),l=j(n)==="x",u=["left","top"].includes(r)?-1:1,m=o&&l?-1:1,a=typeof e=="function"?e(t):e;let{mainAxis:f,crossAxis:p,alignmentAxis:d}=typeof a=="number"?{mainAxis:a,crossAxis:0,alignmentAxis:null}:{mainAxis:0,crossAxis:0,alignmentAxis:null,...a};return c&&typeof d=="number"&&(p=c==="end"?d*-1:d),l?{x:p*m,y:f*u}:{x:f*u,y:p*m}}const re=function(t){return t===void 0&&(t=0),{name:"offset",options:t,async fn(e){const{x:n,y:i}=e,s=await se(e,t);return{x:n+s.x,y:i+s.y,data:s}}}};function At(t){return t==="x"?"y":"x"}const ce=function(t){return t===void 0&&(t={}),{name:"shift",options:t,async fn(e){const{x:n,y:i,placement:s}=e,{mainAxis:o=!0,crossAxis:r=!1,limiter:c={fn:y=>{let{x,y:w}=y;return{x,y:w}}},...l}=t,u={x:n,y:i},m=await J(e,l),a=j(N(s)),f=At(a);let p=u[a],d=u[f];if(o){const y=a==="y"?"top":"left",x=a==="y"?"bottom":"right",w=p+m[y],g=p-m[x];p=rt(w,p,g)}if(r){const y=f==="y"?"top":"left",x=f==="y"?"bottom":"right",w=d+m[y],g=d-m[x];d=rt(w,d,g)}const h=c.fn({...e,[a]:p,[f]:d});return{...h,data:{x:h.x-n,y:h.y-i}}}}},le=function(t){return t===void 0&&(t={}),{options:t,fn(e){const{x:n,y:i,placement:s,rects:o,middlewareData:r}=e,{offset:c=0,mainAxis:l=!0,crossAxis:u=!0}=t,m={x:n,y:i},a=j(s),f=At(a);let p=m[a],d=m[f];const h=typeof c=="function"?c(e):c,y=typeof h=="number"?{mainAxis:h,crossAxis:0}:{mainAxis:0,crossAxis:0,...h};if(l){const g=a==="y"?"height":"width",b=o.reference[a]-o.floating[g]+y.mainAxis,v=o.reference[a]+o.reference[g]-y.mainAxis;p<b?p=b:p>v&&(p=v)}if(u){var x,w;const g=a==="y"?"width":"height",b=["top","left"].includes(N(s)),v=o.reference[f]-o.floating[g]+(b&&((x=r.offset)==null?void 0:x[f])||0)+(b?0:y.crossAxis),O=o.reference[f]+o.reference[g]+(b?0:((w=r.offset)==null?void 0:w[f])||0)-(b?y.crossAxis:0);d<v?d=v:d>O&&(d=O)}return{[a]:p,[f]:d}}}};function E(t){var e;return((e=t.ownerDocument)==null?void 0:e.defaultView)||window}function k(t){return E(t).getComputedStyle(t)}function D(t){return Rt(t)?(t.nodeName||"").toLowerCase():""}let Q;function Ct(){if(Q)return Q;const t=navigator.userAgentData;return t&&Array.isArray(t.brands)?(Q=t.brands.map(e=>e.brand+"/"+e.version).join(" "),Q):navigator.userAgent}function T(t){return t instanceof E(t).HTMLElement}function L(t){return t instanceof E(t).Element}function Rt(t){return t instanceof E(t).Node}function ht(t){if(typeof ShadowRoot>"u")return!1;const e=E(t).ShadowRoot;return t instanceof e||t instanceof ShadowRoot}function nt(t){const{overflow:e,overflowX:n,overflowY:i,display:s}=k(t);return/auto|scroll|overlay|hidden|clip/.test(e+i+n)&&!["inline","contents"].includes(s)}function ae(t){return["table","td","th"].includes(D(t))}function at(t){const e=/firefox/i.test(Ct()),n=k(t),i=n.backdropFilter||n.WebkitBackdropFilter;return n.transform!=="none"||n.perspective!=="none"||(i?i!=="none":!1)||e&&n.willChange==="filter"||e&&(n.filter?n.filter!=="none":!1)||["transform","perspective"].some(s=>n.willChange.includes(s))||["paint","layout","strict","content"].some(s=>{const o=n.contain;return o!=null?o.includes(s):!1})}function Ot(){return!/^((?!chrome|android).)*safari/i.test(Ct())}function ft(t){return["html","body","#document"].includes(D(t))}const gt=Math.min,I=Math.max,et=Math.round;function Et(t){const e=k(t);let n=parseFloat(e.width),i=parseFloat(e.height);const s=t.offsetWidth,o=t.offsetHeight,r=et(n)!==s||et(i)!==o;return r&&(n=s,i=o),{width:n,height:i,fallback:r}}function Lt(t){return L(t)?t:t.contextElement}const Pt={x:1,y:1};function W(t){const e=Lt(t);if(!T(e))return Pt;const n=e.getBoundingClientRect(),{width:i,height:s,fallback:o}=Et(e);let r=(o?et(n.width):n.width)/i,c=(o?et(n.height):n.height)/s;return(!r||!Number.isFinite(r))&&(r=1),(!c||!Number.isFinite(c))&&(c=1),{x:r,y:c}}function H(t,e,n,i){var s,o;e===void 0&&(e=!1),n===void 0&&(n=!1);const r=t.getBoundingClientRect(),c=Lt(t);let l=Pt;e&&(i?L(i)&&(l=W(i)):l=W(t));const u=c?E(c):window,m=!Ot()&&n;let a=(r.left+(m&&((s=u.visualViewport)==null?void 0:s.offsetLeft)||0))/l.x,f=(r.top+(m&&((o=u.visualViewport)==null?void 0:o.offsetTop)||0))/l.y,p=r.width/l.x,d=r.height/l.y;if(c){const h=E(c),y=i&&L(i)?E(i):i;let x=h.frameElement;for(;x&&i&&y!==h;){const w=W(x),g=x.getBoundingClientRect(),b=getComputedStyle(x);g.x+=(x.clientLeft+parseFloat(b.paddingLeft))*w.x,g.y+=(x.clientTop+parseFloat(b.paddingTop))*w.y,a*=w.x,f*=w.y,p*=w.x,d*=w.y,a+=g.x,f+=g.y,x=E(x).frameElement}}return{width:p,height:d,top:f,right:a+p,bottom:f+d,left:a,x:a,y:f}}function F(t){return((Rt(t)?t.ownerDocument:t.document)||window.document).documentElement}function ot(t){return L(t)?{scrollLeft:t.scrollLeft,scrollTop:t.scrollTop}:{scrollLeft:t.pageXOffset,scrollTop:t.pageYOffset}}function kt(t){return H(F(t)).left+ot(t).scrollLeft}function fe(t,e,n){const i=T(e),s=F(e),o=H(t,!0,n==="fixed",e);let r={scrollLeft:0,scrollTop:0};const c={x:0,y:0};if(i||!i&&n!=="fixed")if((D(e)!=="body"||nt(s))&&(r=ot(e)),T(e)){const l=H(e,!0);c.x=l.x+e.clientLeft,c.y=l.y+e.clientTop}else s&&(c.x=kt(s));return{x:o.left+r.scrollLeft-c.x,y:o.top+r.scrollTop-c.y,width:o.width,height:o.height}}function U(t){if(D(t)==="html")return t;const e=t.assignedSlot||t.parentNode||(ht(t)?t.host:null)||F(t);return ht(e)?e.host:e}function xt(t){return!T(t)||k(t).position==="fixed"?null:t.offsetParent}function ue(t){let e=U(t);for(;T(e)&&!ft(e);){if(at(e))return e;e=U(e)}return null}function wt(t){const e=E(t);let n=xt(t);for(;n&&ae(n)&&k(n).position==="static";)n=xt(n);return n&&(D(n)==="html"||D(n)==="body"&&k(n).position==="static"&&!at(n))?e:n||ue(t)||e}function de(t){return Et(t)}function me(t){let{rect:e,offsetParent:n,strategy:i}=t;const s=T(n),o=F(n);if(n===o)return e;let r={scrollLeft:0,scrollTop:0},c={x:1,y:1};const l={x:0,y:0};if((s||!s&&i!=="fixed")&&((D(n)!=="body"||nt(o))&&(r=ot(n)),T(n))){const u=H(n);c=W(n),l.x=u.x+n.clientLeft,l.y=u.y+n.clientTop}return{width:e.width*c.x,height:e.height*c.y,x:e.x*c.x-r.scrollLeft*c.x+l.x,y:e.y*c.y-r.scrollTop*c.y+l.y}}function pe(t,e){const n=E(t),i=F(t),s=n.visualViewport;let o=i.clientWidth,r=i.clientHeight,c=0,l=0;if(s){o=s.width,r=s.height;const u=Ot();(u||!u&&e==="fixed")&&(c=s.offsetLeft,l=s.offsetTop)}return{width:o,height:r,x:c,y:l}}function he(t){var e;const n=F(t),i=ot(t),s=(e=t.ownerDocument)==null?void 0:e.body,o=I(n.scrollWidth,n.clientWidth,s?s.scrollWidth:0,s?s.clientWidth:0),r=I(n.scrollHeight,n.clientHeight,s?s.scrollHeight:0,s?s.clientHeight:0);let c=-i.scrollLeft+kt(t);const l=-i.scrollTop;return k(s||n).direction==="rtl"&&(c+=I(n.clientWidth,s?s.clientWidth:0)-o),{width:o,height:r,x:c,y:l}}function Tt(t){const e=U(t);return ft(e)?t.ownerDocument.body:T(e)&&nt(e)?e:Tt(e)}function X(t,e){var n;e===void 0&&(e=[]);const i=Tt(t),s=i===((n=t.ownerDocument)==null?void 0:n.body),o=E(i);return s?e.concat(o,o.visualViewport||[],nt(i)?i:[]):e.concat(i,X(i))}function ge(t,e){const n=H(t,!0,e==="fixed"),i=n.top+t.clientTop,s=n.left+t.clientLeft,o=T(t)?W(t):{x:1,y:1},r=t.clientWidth*o.x,c=t.clientHeight*o.y,l=s*o.x,u=i*o.y;return{top:u,left:l,right:l+r,bottom:u+c,x:l,y:u,width:r,height:c}}function yt(t,e,n){return e==="viewport"?Z(pe(t,n)):L(e)?ge(e,n):Z(he(F(t)))}function xe(t,e){const n=e.get(t);if(n)return n;let i=X(t).filter(c=>L(c)&&D(c)!=="body"),s=null;const o=k(t).position==="fixed";let r=o?U(t):t;for(;L(r)&&!ft(r);){const c=k(r),l=at(r);(o?!l&&!s:!l&&c.position==="static"&&!!s&&["absolute","fixed"].includes(s.position))?i=i.filter(m=>m!==r):s=c,r=U(r)}return e.set(t,i),i}function we(t){let{element:e,boundary:n,rootBoundary:i,strategy:s}=t;const r=[...n==="clippingAncestors"?xe(e,this._c):[].concat(n),i],c=r[0],l=r.reduce((u,m)=>{const a=yt(e,m,s);return u.top=I(a.top,u.top),u.right=gt(a.right,u.right),u.bottom=gt(a.bottom,u.bottom),u.left=I(a.left,u.left),u},yt(e,c,s));return{width:l.right-l.left,height:l.bottom-l.top,x:l.left,y:l.top}}const ye={getClippingRect:we,convertOffsetParentRelativeRectToViewportRelativeRect:me,isElement:L,getDimensions:de,getOffsetParent:wt,getDocumentElement:F,getScale:W,async getElementRects(t){let{reference:e,floating:n,strategy:i}=t;const s=this.getOffsetParent||wt,o=this.getDimensions;return{reference:fe(e,await s(n),i),floating:{x:0,y:0,...await o(n)}}},getClientRects:t=>Array.from(t.getClientRects()),isRTL:t=>k(t).direction==="rtl"};function ve(t,e,n,i){i===void 0&&(i={});const{ancestorScroll:s=!0,ancestorResize:o=!0,elementResize:r=!0,animationFrame:c=!1}=i,l=s&&!c,u=l||o?[...L(t)?X(t):t.contextElement?X(t.contextElement):[],...X(e)]:[];u.forEach(d=>{l&&d.addEventListener("scroll",n,{passive:!0}),o&&d.addEventListener("resize",n)});let m=null;if(r){let d=!0;m=new ResizeObserver(()=>{d||n(),d=!1}),L(t)&&!c&&m.observe(t),!L(t)&&t.contextElement&&!c&&m.observe(t.contextElement),m.observe(e)}let a,f=c?H(t):null;c&&p();function p(){const d=H(t);f&&(d.x!==f.x||d.y!==f.y||d.width!==f.width||d.height!==f.height)&&n(),f=d,a=requestAnimationFrame(p)}return n(),()=>{var d;u.forEach(h=>{l&&h.removeEventListener("scroll",n),o&&h.removeEventListener("resize",n)}),(d=m)==null||d.disconnect(),m=null,c&&cancelAnimationFrame(a)}}const be=(t,e,n)=>{const i=new Map,s={platform:ye,...n},o={...s.platform,_c:i};return Xt(t,e,{...s,platform:o})};class Ae extends ut.Component{constructor(){super(...arguments),this.element=null}componentDidMount(){this.componentDidUpdate()}componentDidUpdate(){const e=Dt.exports.findDOMNode(this);e instanceof Element?this.element=e:this.element=null}render(){return ut.Children.only(this.props.children)}}const Ce={topLeft:"top-start",topRight:"top-end",bottomLeft:"bottom-start",bottomRight:"bottom-end",leftTop:"left-start",leftBottom:"left-end",rightTop:"right-start",rightBottom:"right-end"};function Re(t){var e;return(e=Ce[t])!==null&&e!==void 0?e:t}const V="adm-popover",Oe={placement:"top",defaultVisible:!1,stopPropagation:["click"],getContainer:()=>document.body},St=C.exports.forwardRef((t,e)=>{const n=Ft(Oe,t),{mode:i="light"}=n,s=Re(n.placement),[o,r]=Mt({value:n.visible,defaultValue:n.defaultVisible,onChange:n.onVisibleChange});C.exports.useImperativeHandle(e,()=>({show:()=>r(!0),hide:()=>r(!1),visible:o}),[o]);const c=C.exports.useRef(null),l=C.exports.useRef(null),u=C.exports.useRef(null),m=$t(n.stopPropagation,vt(n,it("div",{className:st(V,`${V}-${i}`,!o&&`${V}-hidden`),ref:l,children:[R("div",{className:`${V}-arrow`,ref:u,children:R(It,{className:`${V}-arrow-icon`})}),R("div",{className:`${V}-inner`,children:R("div",{className:`${V}-inner-content`,children:n.content})})]}))),[a,f]=C.exports.useState(null);function p(){var h,y,x;return Wt(this,void 0,void 0,function*(){const w=(y=(h=c.current)===null||h===void 0?void 0:h.element)!==null&&y!==void 0?y:null,g=l.current,b=u.current;if(f(w),!w||!g||!b)return;const{x:v,y:O,placement:A,middlewareData:S}=yield be(w,g,{placement:s,middleware:[re(K(12)),ce({padding:K(4),crossAxis:!1,limiter:le()}),oe(),ie(),Gt({element:b,padding:K(12)})]});Object.assign(g.style,{left:`${v}px`,top:`${O}px`});const _=A.split("-")[0],P={top:"bottom",right:"left",bottom:"top",left:"right"}[_],{x:M,y:$}=(x=S.arrow)!==null&&x!==void 0?x:{};Object.assign(b.style,{left:M!=null?`${M}px`:"",top:$!=null?`${$}px`:"",right:"",bottom:"",[P]:`-${K(8)}px`});const q={top:"0deg",bottom:"180deg",left:"270deg",right:"90deg"}[_];b.style.setProperty("--arrow-icon-rotate",q)})}Vt(()=>{p()}),C.exports.useEffect(()=>{if(!a||!n.trigger)return;function h(){r(y=>!y)}return a.addEventListener("click",h),()=>{a.removeEventListener("click",h)}},[a,n.trigger]),C.exports.useEffect(()=>{const h=l.current;if(!(!a||!h))return ve(a,h,p,{elementResize:typeof ResizeObserver<"u"})},[a]),zt(()=>{!n.trigger||r(!1)},[()=>{var h;return(h=c.current)===null||h===void 0?void 0:h.element},l],["click","touchmove"]);const d=Bt(o,!1,n.destroyOnHide);return it(Ht,{children:[R(Ae,{ref:c,children:n.children}),d&&_t(n.getContainer,m)]})}),B="adm-popover-menu",Ee=C.exports.forwardRef((t,e)=>{const n=C.exports.useRef(null);C.exports.useImperativeHandle(e,()=>n.current,[]);const i=C.exports.useCallback(o=>{var r;const{onAction:c}=t;c&&c(o),(r=n.current)===null||r===void 0||r.hide()},[t.onAction]),s=C.exports.useMemo(()=>R("div",{className:`${B}-list`,children:R("div",{className:`${B}-list-inner`,children:t.actions.map((o,r)=>{var c;return it("a",{className:st(`${B}-item`,"adm-plain-anchor",o.disabled&&`${B}-item-disabled`),onClick:()=>{var l;o.disabled||(i(o),(l=o.onClick)===null||l===void 0||l.call(o))},children:[o.icon&&R("div",{className:`${B}-item-icon`,children:o.icon}),R("div",{className:`${B}-item-text`,children:o.text})]},(c=o.key)!==null&&c!==void 0?c:r)})})}),[t.actions,i]);return R(St,{...Object.assign({ref:n},t,{className:st(B,t.className),content:s}),children:t.children})}),Se=jt(St,{Menu:Ee});export{Se as P};
