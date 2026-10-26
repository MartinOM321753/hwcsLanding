'use strict';
// Each carousel measures its complete first set; clones exist only for a seamless loop.
document.querySelectorAll('[data-carousel]').forEach(carousel=>{
 const track=carousel.querySelector('.moving-track'),set=track.querySelector('.moving-set');
 let width=0,offset=0,last=0,dragging=false,pointer=null,startX=0,startOffset=0,moved=false;
 const speed=Number(carousel.dataset.speed)||28;
 const render=()=>{if(!width)return;offset=((offset%width)+width)%width-width;track.style.transform=`translate3d(${offset}px,0,0)`};
 const measure=()=>{width=set.getBoundingClientRect().width;const required=Math.max(2,Math.ceil(carousel.clientWidth/Math.max(width,1))+1);while(track.children.length<required){const clone=set.cloneNode(true);clone.setAttribute('aria-hidden','true');clone.setAttribute('inert','');clone.querySelectorAll('a,button,[tabindex]').forEach(x=>x.tabIndex=-1);track.append(clone)}render()};
 new ResizeObserver(measure).observe(set);measure();
 const tick=now=>{const delta=last?Math.min(now-last,80)/1000:0;last=now;if(!dragging&&!document.hidden&&!(window.siteMotion&&window.siteMotion.matches)){offset-=speed*delta;render()}requestAnimationFrame(tick)};requestAnimationFrame(tick);
 carousel.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'&&e.button!==0)return;dragging=true;pointer=e.pointerId;startX=e.clientX;startOffset=offset;moved=false});
 carousel.addEventListener('pointermove',e=>{if(!dragging||e.pointerId!==pointer)return;const dx=e.clientX-startX;if(Math.abs(dx)>6){moved=true;carousel.setPointerCapture(e.pointerId);carousel.classList.add('dragging');offset=startOffset+dx;render()}});
 const finish=()=>{dragging=false;carousel.classList.remove('dragging')};window.addEventListener('pointerup',finish);carousel.addEventListener('pointercancel',finish);carousel.addEventListener('lostpointercapture',finish);
 carousel.addEventListener('click',e=>{if(moved){e.preventDefault();e.stopPropagation();moved=false}},true);carousel.addEventListener('dragstart',e=>e.preventDefault());
 carousel.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){offset+=e.key==='ArrowRight'?-300:300;render();e.preventDefault()}});
 carousel.addEventListener('wheel',e=>{if(Math.abs(e.deltaX)>Math.abs(e.deltaY)){offset-=e.deltaX;render();e.preventDefault()}},{passive:false});
});
// Links open the matching evaluation before the browser scrolls to its anchor.
document.querySelectorAll('a[href^="#evaluacion-"]').forEach(a=>a.addEventListener('click',()=>{const target=document.querySelector(a.getAttribute('href'));if(target)target.open=true}));
