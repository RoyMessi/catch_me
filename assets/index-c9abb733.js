(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))l(t);new MutationObserver(t=>{for(const e of t)if(e.type==="childList")for(const n of e.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&l(n)}).observe(document,{childList:!0,subtree:!0});function i(t){const e={};return t.integrity&&(e.integrity=t.integrity),t.referrerPolicy&&(e.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?e.credentials="include":t.crossOrigin==="anonymous"?e.credentials="omit":e.credentials="same-origin",e}function l(t){if(t.ep)return;t.ep=!0;const e=i(t);fetch(t.href,e)}})();const _="modulepreload",g=function(o,r){return new URL(o,r).href},f={},d=function(r,i,l){if(!i||i.length===0)return r();const t=document.getElementsByTagName("link");return Promise.all(i.map(e=>{if(e=g(e,l),e in f)return;f[e]=!0;const n=e.endsWith(".css"),y=n?'[rel="stylesheet"]':"";if(!!l)for(let c=t.length-1;c>=0;c--){const a=t[c];if(a.href===e&&(!n||a.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${e}"]${y}`))return;const s=document.createElement("link");if(s.rel=n?"stylesheet":_,n||(s.as="script",s.crossOrigin=""),s.href=e,document.head.appendChild(s),n)return new Promise((c,a)=>{s.addEventListener("load",c),s.addEventListener("error",()=>a(new Error(`Unable to preload CSS for ${e}`)))})})).then(()=>r())};const h="__SHOW_WELCOME_PAGE__",p=document.querySelector("#app");let u=localStorage.getItem(h);u=u===null;async function m(){const o=await(await d(()=>import("./game-3f92dc05.js").then(r=>r.c),[],import.meta.url)).default;new o(p).start().setWindowResizeObserver()}(async o=>{if(!o)m();else{const r=await(await d(()=>import("./index-bd960cac.js"),["./index-bd960cac.js","./game-3f92dc05.js","./welcome-176fec8d.js","./level_constructor-e2d949b5.js"],import.meta.url)).default;new r(p).start().onStartTheGame(()=>{localStorage.setItem(h,!1),m()})}})(u);export{d as _};
