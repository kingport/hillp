/* empty css                    */import{r,m as y,p as b,o as x,G as w,w as g,j as _,g as F,b as u,cq as S}from"./index.5670e6e0.js";import{C as I}from"./CloseCircleFill.55d4b485.js";import{b as K}from"./bound.bddb6539.js";const s="adm-input",k={defaultValue:"",onlyShowClearWhenFocus:!0},E=r.exports.forwardRef((d,v)=>{const e=y(k,d),[t,l]=b(e),[p,c]=r.exports.useState(!1),i=r.exports.useRef(!1),n=r.exports.useRef(null),{locale:m}=x();r.exports.useImperativeHandle(v,()=>({clear:()=>{l("")},focus:()=>{var a;(a=n.current)===null||a===void 0||a.focus()},blur:()=>{var a;(a=n.current)===null||a===void 0||a.blur()},get nativeElement(){return n.current}}));const f=a=>{var o;e.onEnterPress&&(a.code==="Enter"||a.keyCode===13)&&e.onEnterPress(a),(o=e.onKeyDown)===null||o===void 0||o.call(e,a)};w(()=>{var a;if(!!e.enterKeyHint)return(a=n.current)===null||a===void 0||a.setAttribute("enterkeyhint",e.enterKeyHint),()=>{var o;(o=n.current)===null||o===void 0||o.removeAttribute("enterkeyhint")}},[e.enterKeyHint]);function C(){let a=t;e.type==="number"&&(a=a&&K(parseFloat(a),e.min,e.max).toString()),a!==t&&l(a)}const h=(()=>!e.clearable||!t||e.readOnly?!1:e.onlyShowClearWhenFocus?p:!0)();return g(e,_("div",{className:F(`${s}`,e.disabled&&`${s}-disabled`),children:[u("input",{ref:n,className:`${s}-element`,value:t,onChange:a=>{l(a.target.value)},onFocus:a=>{var o;c(!0),(o=e.onFocus)===null||o===void 0||o.call(e,a)},onBlur:a=>{var o;c(!1),C(),(o=e.onBlur)===null||o===void 0||o.call(e,a)},id:e.id,placeholder:e.placeholder,disabled:e.disabled,readOnly:e.readOnly,maxLength:e.maxLength,minLength:e.minLength,max:e.max,min:e.min,autoComplete:e.autoComplete,autoFocus:e.autoFocus,pattern:e.pattern,inputMode:e.inputMode,type:e.type,name:e.name,autoCapitalize:e.autoCapitalize,autoCorrect:e.autoCorrect,onKeyDown:f,onKeyUp:e.onKeyUp,onCompositionStart:a=>{var o;i.current=!0,(o=e.onCompositionStart)===null||o===void 0||o.call(e,a)},onCompositionEnd:a=>{var o;i.current=!1,(o=e.onCompositionEnd)===null||o===void 0||o.call(e,a)},onClick:e.onClick,role:e.role,"aria-valuenow":e["aria-valuenow"],"aria-valuemax":e["aria-valuemax"],"aria-valuemin":e["aria-valuemin"],"aria-label":e["aria-label"]}),h&&u("div",{className:`${s}-clear`,onMouseDown:a=>{a.preventDefault()},onClick:()=>{var a,o;l(""),(a=e.onClear)===null||a===void 0||a.call(e),S()&&i.current&&(i.current=!1,(o=n.current)===null||o===void 0||o.blur())},"aria-label":m.Input.clear,children:u(I,{})})]}))}),R=E;export{R as I};