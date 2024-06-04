const __vite__fileDeps=["assets/errors-KqQQMHTV.js","assets/prod-DxPZqpt5.js","assets/app-BKdByfKa.js"],__vite__mapDeps=i=>i.map(i=>__vite__fileDeps[i]);
var F=Object.defineProperty;var A=(o,t,s)=>t in o?F(o,t,{enumerable:!0,configurable:!0,writable:!0,value:s}):o[t]=s;var u=(o,t,s)=>(A(o,typeof t!="symbol"?t+"":t,s),s);import{ae as N}from"./app-BKdByfKa.js";import{b as L,p as R}from"./prod-DxPZqpt5.js";const b=/^Format:[\s\t]*/,y=/^Style:[\s\t]*/,I=/^Dialogue:[\s\t]*/,S=/[\s\t]*,[\s\t]*/,w=/\{[^}]+\}/g,P=/\\N/g,x=/^\[(.*)[\s\t]?Styles\]$/,m=/^\[(.*)[\s\t]?Events\]$/;class V{constructor(){u(this,"f");u(this,"P",0);u(this,"a",null);u(this,"j",[]);u(this,"k",[]);u(this,"O",null);u(this,"d");u(this,"Q",{})}async init(t){this.f=t,t.errors&&(this.d=(await N(()=>import("./errors-KqQQMHTV.js"),__vite__mapDeps([0,1,2]))).ParseErrorBuilder)}parse(t,s){var e,a;if(this.P)switch(this.P){case 1:if(t==="")this.P=0;else if(y.test(t))if(this.O){const i=t.replace(y,"").split(S);this.T(i)}else this.e((e=this.d)==null?void 0:e.N("Style",s));else b.test(t)?this.O=t.replace(b,"").split(S):m.test(t)&&(this.O=null,this.P=2);break;case 2:if(t==="")this.R();else if(I.test(t))if(this.R(),this.O){const i=t.replace(I,"").split(S),r=this.U(i,s);r&&(this.a=r)}else this.e((a=this.d)==null?void 0:a.N("Dialogue",s));else this.a?this.a.text+=`
`+t.replace(w,"").replace(P,`
`):b.test(t)?this.O=t.replace(b,"").split(S):x.test(t)?(this.O=null,this.P=1):m.test(t)&&(this.O=null)}else t===""||(x.test(t)?(this.O=null,this.P=1):m.test(t)&&(this.O=null,this.P=2))}done(){return{metadata:{},cues:this.j,regions:[],errors:this.k}}R(){var t,s;this.a&&(this.j.push(this.a),(s=(t=this.f).onCue)==null||s.call(t,this.a),this.a=null)}T(t){let s="Default",e={},a,i="center",r="bottom",f,c=1.2,n,p,h=3,d=[];for(let g=0;g<this.O.length;g++){const M=this.O[g],l=t[g];switch(M){case"Name":s=l;break;case"Fontname":e["font-family"]=l;break;case"Fontsize":e["font-size"]=`calc(${l} / var(--overlay-height))`;break;case"PrimaryColour":const _=O(l);_&&(e["--cue-color"]=_);break;case"BorderStyle":h=parseInt(l,10);break;case"BackColour":p=O(l);break;case"OutlineColour":const E=O(l);E&&(n=E);break;case"Bold":parseInt(l)&&(e["font-weight"]="bold");break;case"Italic":parseInt(l)&&(e["font-style"]="italic");break;case"Underline":parseInt(l)&&(e["text-decoration"]="underline");break;case"StrikeOut":parseInt(l)&&(e["text-decoration"]="line-through");break;case"Spacing":e["letter-spacing"]=l+"px";break;case"AlphaLevel":e.opacity=parseFloat(l);break;case"ScaleX":d.push(`scaleX(${parseFloat(l)/100})`);break;case"ScaleY":d.push(`scaleY(${parseFloat(l)/100})`);break;case"Angle":d.push(`rotate(${l}deg)`);break;case"Shadow":c=parseInt(l,10)*1.2;break;case"MarginL":e["--cue-width"]="auto",e["--cue-left"]=parseFloat(l)+"px";break;case"MarginR":e["--cue-width"]="auto",e["--cue-right"]=parseFloat(l)+"px";break;case"MarginV":f=parseFloat(l);break;case"Outline":a=parseInt(l,10);break;case"Alignment":const k=parseInt(l,10);switch(k>=4&&(r=k>=7?"top":"center"),k%3){case 1:i="start";break;case 2:i="center";break;case 3:i="end";break}}}if(e.S=r,e["--cue-white-space"]="normal",e["--cue-line-height"]="normal",e["--cue-text-align"]=i,r==="center"?(e["--cue-top"]="50%",d.push("translateY(-50%)")):e[`--cue-${r}`]=(f||0)+"px",h===1&&(e["--cue-padding-y"]="0"),(h===1||p)&&(e["--cue-bg-color"]=h===1?"none":p),h===3&&n&&(e["--cue-outline"]=`${a}px solid ${n}`),h===1&&typeof a=="number"){const g=p??"#000";e["--cue-text-shadow"]=[n&&T(a*1.2,c*1.2,n),n?T(a*(a/2),c*(a/2),g):T(a,c,g)].filter(Boolean).join(", ")}d.length&&(e["--cue-transform"]=d.join(" ")),this.Q[s]=e}U(t,s){const e=this.V(t),a=this.o(e.Start,e.End,s);if(!a)return;const i=new L(a[0],a[1],""),r={...this.Q[e.Style]||{}},f=e.Name?`<v ${e.Name}>`:"",c=r.S,n=e.MarginL&&parseFloat(e.MarginL),p=e.MarginR&&parseFloat(e.MarginR),h=e.MarginV&&parseFloat(e.MarginV);return n&&(r["--cue-width"]="auto",r["--cue-left"]=n+"px"),p&&(r["--cue-width"]="auto",r["--cue-right"]=p+"px"),h&&c!=="center"&&(r[`--cue-${c}`]=h+"px"),i.text=f+t.slice(this.O.length-1).join(", ").replace(w,"").replace(P,`
`),delete r.S,Object.keys(r).length&&(i.style=r),i}V(t){const s={};for(let e=0;e<this.O.length;e++)s[this.O[e]]=t[e];return s}o(t,s,e){var r,f,c;const a=R(t),i=R(s);if(a!==null&&i!==null&&i>a)return[a,i];a===null&&this.e((r=this.d)==null?void 0:r.q(t,e)),i===null&&this.e((f=this.d)==null?void 0:f.r(s,e)),a!=null&&i!==null&&i>a&&this.e((c=this.d)==null?void 0:c.s(a,i,e))}e(t){var s,e;if(t){if(this.k.push(t),this.f.strict)throw this.f.cancel(),t;(e=(s=this.f).onError)==null||e.call(s,t)}}}function O(o){const t=parseInt(o.replace("&H",""),16);if(t>=0){const e=(t>>24&255^255)/255,a=t>>16&255,i=t>>8&255;return"rgba("+[t&255,i,a,e].join(",")+")"}return null}function T(o,t,s){const e=Math.ceil(2*Math.PI*o);let a="";for(let i=0;i<e;i++){const r=2*Math.PI*i/e;a+=o*Math.cos(r)+"px "+t*Math.sin(r)+"px 0 "+s+(i==e-1?"":",")}return a}function C(){return new V}export{V as SSAParser,C as default};
