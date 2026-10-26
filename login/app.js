'use strict';
// Interface only: no credentials are transmitted or persisted.
const password=document.querySelector('#password');
const toggle=document.querySelector('.password-toggle');
toggle.addEventListener('click',()=>{const show=password.type==='password';password.type=show?'text':'password';toggle.setAttribute('aria-pressed',String(show));toggle.setAttribute('aria-label',show?'Ocultar contraseña':'Mostrar contraseña')});
const caps=document.querySelector('#caps-warning');password.addEventListener('keyup',e=>{caps.hidden=!e.getModifierState('CapsLock')});password.addEventListener('blur',()=>{caps.hidden=true});
document.querySelector('#login-form').addEventListener('submit',event=>event.preventDefault());
const recovery=document.querySelector('#recovery-dialog'),trigger=document.querySelector('#recover-password');trigger.addEventListener('click',()=>recovery.showModal());recovery.querySelector('.dialog-close').addEventListener('click',()=>recovery.close());recovery.addEventListener('click',e=>{if(e.target!==recovery)return;const b=recovery.getBoundingClientRect();if(e.clientX<b.left||e.clientX>b.right||e.clientY<b.top||e.clientY>b.bottom)recovery.close()});recovery.addEventListener('close',()=>trigger.focus());
const card=document.querySelector('.access-card');card.addEventListener('pointermove',e=>{const r=card.getBoundingClientRect();card.style.setProperty('--spot-x',(e.clientX-r.left)+'px');card.style.setProperty('--spot-y',(e.clientY-r.top)+'px')});card.addEventListener('pointerleave',()=>{card.style.removeProperty('--spot-x');card.style.removeProperty('--spot-y')});
// A live three-dimensional toroidal field, drawn locally without image libraries.
(()=>{
const canvas=document.querySelector('#connection-field'),ctx=canvas.getContext('2d');if(!ctx)return;
const reduce=matchMedia('(prefers-reduced-motion: reduce)');let w=0,h=0,dpr=1,frame=0,previous=0,time=0,focused=false;let pointer={x:-2000,y:-2000},follow={x:0,y:0};
const particles=Array.from({length:80},(_,i)=>({u:(i*.61803398875)%1,v:(i*.381966+0.13)%1,r:.5+(i%5)*.24,phase:i*1.7}));
function resize(){w=innerWidth;h=innerHeight;dpr=Math.min(devicePixelRatio||1,1.5);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);draw()}
function point(u,v,t){const R=1.3,r=.30+.035*Math.sin(u*5+t);let x=(R+r*Math.cos(v))*Math.cos(u),y=(R+r*Math.cos(v))*Math.sin(u),z=r*Math.sin(v);const tilt=.49+Math.sin(t*.11)*.11;let yy=y*Math.cos(tilt)-z*Math.sin(tilt),zz=y*Math.sin(tilt)+z*Math.cos(tilt);const spin=.19+Math.sin(t*.08)*.13;let xx=x*Math.cos(spin)-yy*Math.sin(spin);yy=x*Math.sin(spin)+yy*Math.cos(spin);const perspective=3.8/(3.8+zz),size=Math.min(w*.48,h*.57);return {x:w*.5+xx*size*perspective+follow.x,y:h*.47+yy*size*.9*perspective+follow.y,z:zz,alpha:.12+(zz+1.6)/3.2*.28}}
function draw(){canvas.dataset.motionFrame=String(Math.round(time*100));ctx.clearRect(0,0,w,h);const t=time;follow.x+=((pointer.x>-1000?(pointer.x/w-.5)*10:0)-follow.x)*.025;follow.y+=((pointer.y>-1000?(pointer.y/h-.5)*8:0)-follow.y)*.025;
// Broad, slow light behind the filaments.
const glow=ctx.createRadialGradient(w*.5,h*.47,10,w*.5,h*.47,Math.min(w*.6,h*.65));glow.addColorStop(0,'rgba(70,113,72,.02)');glow.addColorStop(.65,'rgba(114,143,81,.035)');glow.addColorStop(1,'rgba(10,28,22,0)');ctx.fillStyle=glow;ctx.fillRect(0,0,w,h);
const lanes=w<650?18:30,segments=w<650?100:150;ctx.lineWidth=.55;
for(let lane=0;lane<lanes;lane++){const v=lane/lanes*Math.PI*2+t*.055;ctx.beginPath();for(let k=0;k<=segments;k++){const u=k/segments*Math.PI*2;const p=point(u,v+.16*Math.sin(u*3+t*.18),t);if(k===0)ctx.moveTo(p.x,p.y);else ctx.lineTo(p.x,p.y)}ctx.strokeStyle=lane%6===0?'rgba(199,172,118,.35)':'rgba(148,194,136,.22)';ctx.stroke()}
// Short crosslinks make a continuous organic lattice.
for(let rib=0;rib<78;rib++){const u=rib/78*Math.PI*2+t*.025;ctx.beginPath();for(let j=0;j<=18;j++){const p=point(u,j/18*Math.PI*2+t*.055,t);if(j===0)ctx.moveTo(p.x,p.y);else ctx.lineTo(p.x,p.y)}ctx.strokeStyle='rgba(165,197,138,.075)';ctx.stroke()}
for(let i=0;i<245;i++){const u=(i*.61803398875%1)*Math.PI*2+t*.08,v=(i*.41421356%1)*Math.PI*2+t*.055,p=point(u,v,t),d=Math.hypot(p.x-pointer.x,p.y-pointer.y),near=Math.max(0,1-d/160);const pulse=.5+.5*Math.sin(t*(.8+i%4*.13)+i*2);const size=(i%17===0?2: i%5===0?1.3:.65)*(1+near*.7);ctx.beginPath();ctx.arc(p.x,p.y,size,0,Math.PI*2);ctx.fillStyle=i%9===0?`rgba(228,205,149,${.3+pulse*.4+near*.2})`:`rgba(193,225,174,${p.alpha+pulse*.2+near*.25})`;ctx.fill();if(i%17===0||near>.45){const halo=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,size*7);halo.addColorStop(0,`rgba(215,224,171,${.12+near*.13})`);halo.addColorStop(1,'rgba(215,224,171,0)');ctx.fillStyle=halo;ctx.fillRect(p.x-size*7,p.y-size*7,size*14,size*14)}}
// Energy glides through a handful of strands; field activity increases gently on focus.
for(let spark=0;spark<7;spark++){const u=t*(focused?.17:.10)+spark*.9,v=spark*1.8+t*.055;for(let trail=0;trail<18;trail++){const p=point(u-trail*.007,v,t),alpha=(1-trail/18)*.65;ctx.beginPath();ctx.arc(p.x,p.y,trail===0?1.8:1,0,Math.PI*2);ctx.fillStyle=`rgba(244,226,174,${alpha})`;ctx.fill()}}
// Luminous bodies travel along independent elliptical lanes with short orbital trails.
for(let body=0;body<12;body++){
 const velocity=.17+(body%4)*.035, u=t*velocity+body*2.399963, v=body*.72+t*.055;
 const p=point(u,v,t),radius=1.8+(body%3)*.65,depth=.65+(p.z+1.6)/6.4;
 for(let tail=20;tail>0;tail--){const q=point(u-tail*.009,v,t);ctx.beginPath();ctx.arc(q.x,q.y,radius*.45,0,Math.PI*2);ctx.fillStyle=`rgba(229,225,191,${(1-tail/21)*.20*depth})`;ctx.fill()}
 const halo=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,radius*9);halo.addColorStop(0,`rgba(247,239,202,${.25*depth})`);halo.addColorStop(.28,`rgba(224,231,191,${.08*depth})`);halo.addColorStop(1,'rgba(224,231,191,0)');ctx.fillStyle=halo;ctx.fillRect(p.x-radius*9,p.y-radius*9,radius*18,radius*18);
 ctx.beginPath();ctx.arc(p.x,p.y,radius*depth,0,Math.PI*2);ctx.fillStyle=body%3===0?'#eee0b4':'#f0f4df';ctx.fill();
}
for(let i=0;i<particles.length;i++){const a=particles[i],x=(a.u*w+Math.sin(t*.08+a.phase)*12),y=((a.v*h-t*(1+i%3*.2))%h+h)%h;const flicker=.18+.17*(.5+.5*Math.sin(t*.8+a.phase));ctx.fillStyle=`rgba(217,227,190,${flicker})`;ctx.beginPath();ctx.arc(x,y,a.r,0,Math.PI*2);ctx.fill()}
// Quiet precision marks at the edges.
ctx.strokeStyle='rgba(178,197,150,.13)';ctx.lineWidth=.6;for(const x of [24,w-24]){for(const y of [h*.25,h*.5,h*.75]){ctx.beginPath();ctx.moveTo(x-3,y);ctx.lineTo(x+3,y);ctx.moveTo(x,y-3);ctx.lineTo(x,y+3);ctx.stroke()}}
}
function tick(now){if(document.hidden){frame=0;return}if(now-previous>32){time+=Math.min((now-previous)/1000,.1)*(reduce.matches?.2:1.5);previous=now;draw()}frame=requestAnimationFrame(tick)}
function start(){document.querySelectorAll('.living-atom animateMotion').forEach((el,i)=>el.setAttribute('dur',reduce.matches?(12+i*3)+'s':[2.8,3.6,2.2][i]+'s'));cancelAnimationFrame(frame);previous=performance.now();canvas.dataset.motionMode=reduce.matches?'suave':'completo';draw();frame=requestAnimationFrame(tick)}
window.addEventListener('resize',resize,{passive:true});window.addEventListener('pointermove',e=>{pointer.x=e.clientX;pointer.y=e.clientY},{passive:true});document.addEventListener('pointerleave',()=>{pointer.x=-2000;pointer.y=-2000});document.querySelectorAll('input').forEach(input=>{input.addEventListener('focus',()=>focused=true);input.addEventListener('blur',()=>focused=false)});document.addEventListener('visibilitychange',()=>{if(document.hidden)cancelAnimationFrame(frame);else start()});reduce.addEventListener('change',start);resize();start();
})();

// Fit the form to its viewport allocation without clipping controls or hiding overflow.
(()=>{const stage=document.querySelector('.access-stage'),card=document.querySelector('.access-card'),fit=document.querySelector('.card-fit');if(!stage||!card||!fit)return;let queued=false;const measure=()=>{queued=false;const css=getComputedStyle(stage),available=stage.clientHeight-parseFloat(css.paddingTop)-parseFloat(css.paddingBottom),scale=Math.min(1,Math.max(.1,available/card.offsetHeight));fit.style.setProperty('--card-fit',scale.toFixed(4));};const schedule=()=>{if(!queued){queued=true;requestAnimationFrame(measure)}};new ResizeObserver(schedule).observe(stage);new ResizeObserver(schedule).observe(card);window.addEventListener('resize',schedule,{passive:true});if(window.visualViewport)window.visualViewport.addEventListener('resize',schedule,{passive:true});document.fonts.ready.then(schedule);measure()})();
