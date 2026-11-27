(()=>{
'use strict';
const root=document.documentElement, body=document.body;
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
const fine=matchMedia('(hover:hover) and (pointer:fine)').matches;
const loader=document.getElementById('loading');
const loaderProgress=document.querySelector('.loader-progress');
const cursor=document.querySelector('.cursor-ring');
const halo=document.querySelector('.mouse-halo');
const cards=[...document.querySelectorAll('.world')];
let pointerX=innerWidth/2,pointerY=innerHeight/2,followX=pointerX,followY=pointerY,mode='neutral',lastCanvas=0;
let mouseVisible=false;
const markReady=()=>{body.classList.add('ready');loader?.classList.add('is-gone')};
if(reduce) markReady(); else {
 let start=performance.now();
 const progress=()=>{const k=Math.min(100,Math.round((performance.now()-start)/16.5));if(loaderProgress)loaderProgress.textContent=String(k).padStart(2,'0');if(k<100)requestAnimationFrame(progress)};
 requestAnimationFrame(progress);
 setTimeout(markReady,1710);
}
const canvas=document.getElementById('ambient-canvas'),ctx=canvas.getContext('2d',{alpha:true});
let width=innerWidth,height=innerHeight,dpr=1;
let particles=[];
let nextSeed=4619;
function seeded(){nextSeed=(nextSeed*1664525+1013904223)>>>0;return nextSeed/4294967296}
function resize(){width=innerWidth;height=innerHeight;dpr=Math.min(devicePixelRatio||1,1.7);canvas.width=Math.floor(width*dpr);canvas.height=Math.floor(height*dpr);canvas.style.width=width+'px';canvas.style.height=height+'px';ctx.setTransform(dpr,0,0,dpr,0,0);particles=Array.from({length:width<750?33:68},(_,i)=>({x:seeded()*width,y:seeded()*height,rx:seeded()*.8+.2,phase:seeded()*Math.PI*2,size:seeded()*1.25+.3,depth:seeded()*.9+.1}));}
resize();addEventListener('resize',resize,{passive:true});
const activeColors={neutral:[146,168,193],navs:[163,202,238],pcbt:[66,213,204]};
let flowY=0;
function draw(t){
 if(document.hidden)return;
 ctx.clearRect(0,0,width,height);
 let color=activeColors[mode]||activeColors.neutral;
 const scrolled=scrollY||0;
 const factor=(width<750?.45:1);
 if(!reduce){
  for(let i=0;i<particles.length;i++){
   let p=particles[i],px=p.x+Math.sin(t*.00034+p.phase)*22*p.depth,py=p.y+Math.cos(t*.00026+p.phase*3)*19*p.depth-scrolled*.06*p.depth;
   if(py<0)py+=height;if(py>height)py-=height;
   if(fine&&mouseVisible){let dx=px-pointerX,dy=py-pointerY,dist=Math.max(40,Math.hypot(dx,dy));if(dist<245){px+=(dx/dist)*(245-dist)*.14;py+=(dy/dist)*(245-dist)*.14}}
   const a=.11+.16*p.depth;
   ctx.beginPath();ctx.arc(px,py,p.size,0,Math.PI*2);ctx.fillStyle=`rgba(${color[0]},${color[1]},${color[2]},${a*factor})`;ctx.fill();
   if(i%4===0){let q=particles[(i+9)%particles.length];let qx=q.x+Math.sin(t*.0003+q.phase)*18;let qy=q.y+Math.cos(t*.0002+q.phase)*17;let d=Math.hypot(qx-px,qy-py);if(d<240){ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(qx,qy);ctx.strokeStyle=`rgba(${color[0]},${color[1]},${color[2]},${(.11-d/300)*factor})`;ctx.lineWidth=.6;ctx.stroke()}}
  }
  if(mode==='pcbt'){
   for(let line=0;line<7;line++){
    ctx.beginPath();let base=height*.54+line*19;
    for(let x=-20;x<width+40;x+=12){let y=base+Math.sin(x*.008+t*.00085+line*.23)*28+Math.sin(x*.015-t*.00055+line*.9)*12;if(x===-20)ctx.moveTo(x,y);else ctx.lineTo(x,y)}
    ctx.strokeStyle=`rgba(65,215,198,${.024+line*.003})`;ctx.lineWidth=.75;ctx.stroke();
   }
  }
  if(mode==='navs'){
   let off=t*.01%110;
   ctx.strokeStyle='rgba(164,200,233,.045)';ctx.lineWidth=1;
   for(let x=-110+off;x<width+110;x+=110){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,height);ctx.stroke()}
   for(let y=60;y<height;y+=110){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(width,y);ctx.stroke()}
  }
 }
}
let rafStarted=false;
function animate(now){
 if(!document.hidden){
  if(!reduce)draw(now);
  if(fine&&mouseVisible){followX+=(pointerX-followX)*.13;followY+=(pointerY-followY)*.13;
   halo.style.transform=`translate3d(${followX-260}px,${followY-260}px,0)`;
   const w=cursor.classList.contains('over-world')?92:66;
   cursor.style.transform=`translate3d(${followX-w/2}px,${followY-w/2}px,0)`;
  }
 }
 requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
if(fine&&!reduce){
 addEventListener('pointermove',e=>{pointerX=e.clientX;pointerY=e.clientY;root.style.setProperty('--mouse-x',`${pointerX}px`);root.style.setProperty('--mouse-y',`${pointerY}px`);if(!mouseVisible){followX=pointerX;followY=pointerY;mouseVisible=true;halo.classList.add('visible');cursor.classList.add('is-visible')}},{passive:true});
 document.addEventListener('mouseleave',()=>{mouseVisible=false;halo.classList.remove('visible');cursor.classList.remove('is-visible')});
}
const setMode=v=>{mode=v||'neutral';body.dataset.active=mode};
cards.forEach(card=>{
 const type=card.dataset.world;
 const enter=()=>{setMode(type);cursor.classList.add('over-world')};
 const leave=()=>{setMode('neutral');cursor.classList.remove('over-world');card.style.transform='';card.style.setProperty('--px','50%');card.style.setProperty('--py','50%')};
 card.addEventListener('pointerenter',enter);
 card.addEventListener('pointerleave',leave);
 card.addEventListener('focus',enter);
 card.addEventListener('blur',leave);
 if(fine&&!reduce)card.addEventListener('pointermove',e=>{
  const b=card.getBoundingClientRect(),dx=(e.clientX-b.left)/b.width-.5,dy=(e.clientY-b.top)/b.height-.5;
  card.style.setProperty('--px',((dx+.5)*100).toFixed(1)+'%');card.style.setProperty('--py',((dy+.5)*100).toFixed(1)+'%');
  card.style.transform=`perspective(1050px) rotateY(${(dx*4.8).toFixed(2)}deg) rotateX(${(-dy*4.2).toFixed(2)}deg) translateY(-6px) scale(1.012)`;
 },{passive:true});
});
const revealTargets=[...document.querySelectorAll('.scroll-reveal')];
if('IntersectionObserver' in window){const obs=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-seen');obs.unobserve(entry.target)}}),{threshold:.13});revealTargets.forEach(t=>obs.observe(t))}else revealTargets.forEach(t=>t.classList.add('is-seen'));
// Keep the exit transition, but never restore its full-screen curtain from BFCache.
// Browsers can resume a previously visited page exactly as it looked on navigation away.
const exitCurtain=document.getElementById('exit-curtain');
let navigationTimer=null;
function resetNavigationSurface(){
 if(navigationTimer!==null){clearTimeout(navigationTimer);navigationTimer=null;}
 exitCurtain?.classList.remove('out');
 setMode('neutral');
 cursor?.classList.remove('over-world','is-visible');
 halo?.classList.remove('visible');
 mouseVisible=false;
 cards.forEach(card=>{card.style.transform='';card.style.setProperty('--px','50%');card.style.setProperty('--py','50%');});
}
// pagehide runs after the departure animation; clean state before the browser caches it.
addEventListener('pagehide',()=>{exitCurtain?.classList.remove('out');});
// pageshow runs when Back/Forward restores the document (unlike DOMContentLoaded).
addEventListener('pageshow',event=>{
 if(event.persisted || exitCurtain?.classList.contains('out')){
  resetNavigationSurface();
  body.classList.add('ready');
  loader?.classList.add('is-gone');
 }
});
if(!reduce)document.querySelectorAll('a.transition-link').forEach(link=>link.addEventListener('click',e=>{
 if(e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
 const url=link.getAttribute('href');if(!url||url.startsWith('#'))return;
 e.preventDefault();
 exitCurtain?.classList.add('out');
 navigationTimer=setTimeout(()=>{navigationTimer=null;location.href=url},600);
}));
document.getElementById('year').textContent=new Date().getFullYear();
addEventListener('blur',()=>{setMode('neutral');halo.classList.remove('visible');cursor.classList.remove('is-visible');mouseVisible=false});
})();
