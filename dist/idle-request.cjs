"use strict";Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"});const p=typeof performance!==void 0,d=new Map,h=5,m=window.fetch,w=XMLHttpRequest.prototype.send;window.fetch=function(...o){const t={startTime:performance.now(),endTime:-1},e=m.apply(this,o);return d.set(e,t),e.then(n=>(t.endTime=performance.now(),n)).catch(n=>{throw t.endTime=performance.now(),n}).finally(()=>{d.delete(e)}),e};XMLHttpRequest.prototype.send=function(...o){const t={startTime:performance.now(),endTime:-1},e=this,n=()=>{t.endTime=performance.now(),d.delete(e)};return e.addEventListener("load",n),e.addEventListener("error",n),e.addEventListener("abort",n),d.set(e,t),w.apply(this,o)};const v=(o,t)=>{const e=[];let n=o.length;return p?new Promise(a=>{let c=0;const i=o.length,u=()=>{let r=c;o[r]().then(s=>{e[r]={status:"fulfilled",value:s},t&&t(s,r)}).catch(s=>{e[r]={status:"rejected",reason:s},t&&t(s,r)}).finally(()=>{n--})},f=()=>{const r=h-d.size;if(n===0)return l.disconnect(),a(e);if(c<i&&r>0)for(let s=0;s<Math.min(r,i);s++)u(),c++},l=new PerformanceObserver(f);window.onload=function(){l.observe({type:"resource"}),f()}}):new Promise(a=>{o.forEach((c,i)=>{c().then(u=>{e[i]={status:"fulfilled",value:u},t&&t(u,i)}).catch(u=>{e[i]={status:"rejected",reason:u},t&&t(u,i)}).finally(()=>{n--,n===0&&a(e)})})})};exports.IdleRequest=v;
