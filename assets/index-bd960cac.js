import{E as y,g as p,C as L,I as b,N as S,A as h,r as T,s as E,G as w,a as g,V as u,K as x}from"./game-3f92dc05.js";import{LEVELS as k}from"./welcome-176fec8d.js";import"./index-c9abb733.js";import"./level_constructor-e2d949b5.js";function A(){return'<div id="welcome" class="d-flex flex-d-column flex-center main-color"></div>'}function _(){let e="",t="",n="";return y.forEach(r=>{const o=m(p(r));o.style.position="relative",e+=o.outerHTML}),Object.keys(L).forEach(r=>{const o=m(b.collectable(null,r));S.includes(r)?t+=o.outerHTML:n+=o.outerHTML}),`<h1>Welcome to ${h}!</h1>
  <h2 class="mt-2">Some information before starting the game:</h2>
  <h3 class="mt-2">Good collectables:</h3>
  <div class="d-flex flex-d-row">${n}</div>
  <h3 class="mt-2">Bad collectables:</h3>
  <div class="d-flex flex-d-row">${t}</div>
  <h3 class="mt-2">Avoid those devils:</h3>
  <div class="d-flex flex-d-row">${e}</div>
  <div class="d-flex flex-d-row flex-gap-1 mt-2">
  <button class='btn mt-2' data-next-step>Got it</button>
  </div>`}function C(){let e="";return["left","up","down","right"].forEach(t=>{e+=`<button class="key-${t}"><i class="keyboard arrow ${t}"></i></button>`}),`<h1>Try the demo!</h1>
  <h3>Type on the arrow buttons on your keyboard to move the character</h3>
  <div class="keyboard arrows-demo mt-2">${e}</div>
  <div id='game_demo' class='mt-2 w-100'></div>
  <div class='d-none mt-2'><button class='btn' data-next-step>Next</button></div>`}function m(e){return T(e),E(e),e}function M(){return`<h2>Well done!</h2>
  <div class="flex-center flex-d-column" data-delay-display>
  <h2>Let's collect yummy food</h2>
    <div class="d-flex flex-d-row flex-gap-1 mt-2">
    <button class='btn' data-next-step>Yes!</button>
    <button class='btn' data-dont-want-to-play>No</button>
    </div>
  </div>`}function O(e,t){return e.insertAdjacentHTML("afterbegin",_()),{setup(){e.querySelector("[data-next-step]").addEventListener("click",t,{once:!0})},tearDown(){e.querySelector("[data-next-step]").removeEventListener("click",t,{once:!0})}}}function N(e,t){e.insertAdjacentHTML("afterbegin",C());const n=document.querySelector(".keyboard.arrows-demo"),r=e.querySelector("[data-next-step]"),o=new w(e.querySelector("#game_demo"),k);let c,s;function l(){s==null||s.classList.remove("active")}function d(a){u.includes(a.key)&&(l(),c=`.key-${x[a.key]}`,s=n.querySelector(c),s.classList.add("active"))}function i(a){u.includes(a.key)&&l()}return{setup(){document.addEventListener("keydown",d),document.addEventListener("keyup",i),r.addEventListener("click",t,{once:!0}),o.noHeader().toggleStatistics(!1).toggleSounds(!1).setObserver(a=>{a.eventName===g.NO_MORE_COLLECTABLES&&t()}).setWindowResizeObserver().start()},tearDown(){o.tearDown(),document.removeEventListener("keydown",d),document.removeEventListener("keyup",onkeyup)}}}function H(e,t){e.insertAdjacentHTML("afterbegin",M());function n(){confirm(`Window will close.
Are you sure you don't want to try the game?`)&&window.close()}return{setup(){e.querySelector("[data-dont-want-to-play]").addEventListener("click",n),e.querySelector("[data-next-step]").addEventListener("click",t,{once:!0})},tearDown(){e.querySelector("[data-dont-want-to-play]").removeEventListener("click",n),e.querySelector("[data-next-step]").removeEventListener("click",t,{once:!0})}}}const f=[O,N,H];function P(e){let t,n=1,r,o;function c(){n++,r.tearDown(),i(),s()}function s(){typeof f[n-1]=="function"?(r=f[n-1](t,c),r.setup()):(a(),o())}function l(v){o=v}function d(){return document.body.classList.add("welcome-page"),e.insertAdjacentHTML("afterbegin",A()),t=e.firstChild,s(),this}function i(){t.innerHTML=""}function a(){return document.body.classList.remove("welcome-page"),e.innerHTML="",this}return{start:d,tearDown:a,onStartTheGame:l}}export{P as default};
