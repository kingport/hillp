import{b as d}from"./bound.bddb6539.js";function O(r,u,b){return r*u*b/(u+b*r)}function I(r,u,b,e,f=.15){return f===0?d(r,u,b):r<u?-O(u-r,e,f)+u:r>b?+O(r-b,e,f)+b:r}export{I as r};
