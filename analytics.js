'use strict';
(()=>{
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const obsRoot=document.querySelector('#observation-plot');if(!obsRoot)return;
 const chartObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('chart-is-visible');}else{e.target.classList.remove('chart-is-visible')}}),{threshold:.15});document.querySelectorAll('.science-chart').forEach(el=>chartObserver.observe(el));
 let seed=1736;const random=()=>{seed=(seed*16807)%2147483647;return (seed-1)/2147483646};
 const clamp=v=>Math.max(4,Math.min(96,v));
 const seriesA=Array.from({length:48},(_,i)=>clamp(54+11*Math.cos(i/8)+8*Math.sin(i/3)+((random()+random()+random())/3-.5)*58));
 const seriesB=Array.from({length:48},(_,i)=>clamp(30+9*Math.cos(i/10)+5*Math.sin(i/5)+((random()+random()+random())/3-.5)*49));
 const average=values=>values.map((_,i)=>{const a=values.slice(Math.max(0,i-3),Math.min(values.length,i+4));return a.reduce((a,b)=>a+b,0)/a.length});
 const line=points=>points.map(([x,y],i)=>`${i?'L':'M'}${x.toFixed(2)},${y.toFixed(2)}`).join(' ');
 const dot=(x,y,color,tip,i,r=4.3,stroke='none')=>`<circle class="science-data-point" data-viz-point data-tooltip="${tip}" tabindex="${i%5===0?0:-1}" role="img" aria-label="${tip}" cx="${x}" cy="${y}" r="${r}" fill="${color}" stroke="${stroke}" stroke-width="1.2" style="--point-delay:${i%20*18}ms"><title>${tip}</title></circle>`;
 const grid=({w,h,left=64,right=24,top=20,bottom=54,xTicks=12,xLabels,xTitle='Cortes de seguimiento',yTitle='Índice ilustrativo'})=>{
 const width=w-left-right,height=h-top-bottom,x=i=>left+i*width/(xTicks-1),y=v=>top+height-v/100*height;
 const horizontal=[0,20,40,60,80,100].map(v=>`<line x1="${left}" x2="${w-right}" y1="${y(v)}" y2="${y(v)}" stroke="#dfe4ed"/><text x="${left-12}" y="${y(v)+5}" text-anchor="end">${v}</text>`).join('');
 const vertical=Array.from({length:xTicks},(_,i)=>`<line x1="${x(i)}" x2="${x(i)}" y1="${top}" y2="${h-bottom}" stroke="#eef1f6"/><text x="${x(i)}" y="${h-bottom+25}" text-anchor="middle">${xLabels?xLabels[i]:String(i+1).padStart(2,'0')}</text>`).join('');
 return {x,y,body:`<g class="science-grid">${horizontal}${vertical}<text class="axis-title" x="${left+width/2}" y="${h-6}" text-anchor="middle">${xTitle}</text><text class="axis-title" transform="translate(16 ${top+height/2}) rotate(-90)" text-anchor="middle">${yTitle}</text></g>`};
 };
 function bindTooltip(root){let tooltip=root.querySelector('.science-tooltip');if(!tooltip){tooltip=document.createElement('div');tooltip.className='science-tooltip';tooltip.hidden=true;root.append(tooltip)}
 const show=(point)=>{tooltip.textContent=point.dataset.tooltip;tooltip.hidden=false;const p=point.getBoundingClientRect(),r=root.getBoundingClientRect();tooltip.style.left=Math.max(5,Math.min(r.width-220,p.left-r.left-70))+'px';tooltip.style.top=Math.max(0,p.top-r.top-43)+'px'};
 root.onpointermove=e=>{const point=e.target.closest('[data-viz-point]');if(point)show(point);else tooltip.hidden=true};root.onpointerleave=()=>tooltip.hidden=true;
 root.querySelectorAll('[data-viz-point]').forEach(p=>{p.onfocus=()=>show(p);p.onblur=()=>tooltip.hidden=true;p.onclick=()=>show(p)});
 }
 function observations(range=12){const count=range*4,start=48-count,values=[seriesA.slice(start),seriesB.slice(start)],colors=['#4f8ec0','#e59b22'],w=1080,h=390;const g=grid({w,h,xTicks:range,xLabels:Array.from({length:range},(_,i)=>String(i+13-range).padStart(2,'0'))});
 const x=i=>64+i*(w-88)/(count-1);const graphs=values.map((v,k)=>{const means=average(v),path=line(means.map((v,i)=>[x(i),g.y(v)]));return `<g><path class="science-trend" pathLength="1" d="${path}" fill="none" stroke="${colors[k]}" stroke-width="2.6" stroke-linejoin="round"/>${v.map((v,i)=>dot(x(i),g.y(v),colors[k],`Corte ${String(Math.floor(i/4)+13-range).padStart(2,'0')} · Observación ${k?'B':'A'}: ${v.toFixed(1)}`,i)).join('')}</g>`}).join('');
 obsRoot.innerHTML=`<svg class="observation-svg" viewBox="0 0 ${w} ${h}" role="group" aria-label="Datos ficticios: observaciones de dos series y sus tendencias en ${range} cortes">${g.body}${graphs}</svg>`;bindTooltip(obsRoot);document.querySelectorAll('[data-range]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.range)===range)));
 }
 document.querySelectorAll('[data-range]').forEach(b=>b.onclick=()=>observations(Number(b.dataset.range)));observations();
 // A reproducible synthetic cloud with its actual least-squares fit.
 const cloud=Array.from({length:240},()=>{const x=clamp(48+(random()+random()+random()+random()-2)*30);const y=clamp(12+.72*x+(random()+random()+random()-1.5)*30);return {x,y}});
 const mx=cloud.reduce((a,p)=>a+p.x,0)/cloud.length,my=cloud.reduce((a,p)=>a+p.y,0)/cloud.length;
 const sxx=cloud.reduce((a,p)=>a+(p.x-mx)**2,0),syy=cloud.reduce((a,p)=>a+(p.y-my)**2,0),sxy=cloud.reduce((a,p)=>a+(p.x-mx)*(p.y-my),0),slope=sxy/sxx,intercept=my-slope*mx,r2=sxy*sxy/(sxx*syy);
 const root=document.querySelector('#correlation-plot'),w=565,h=365,g=grid({w,h,left:64,right:23,top:20,bottom:58,xTicks:6,xLabels:[0,20,40,60,80,100],xTitle:'Indicador A · Escala ilustrativa',yTitle:'Indicador B · Escala ilustrativa'}),x=v=>64+v/100*(w-87);
 root.innerHTML=`<svg viewBox="0 0 ${w} ${h}" role="group" aria-label="Nube de 240 observaciones ficticias con recta de ajuste; R cuadrada ${r2.toFixed(2)}">${g.body}<g>${cloud.map((p,i)=>{const t=p.y/100,color=`hsl(${220+t*80} ${35+t*12}% ${85-t*51}%)`;return dot(x(p.x),g.y(p.y),color,`Observación ${i+1} · A: ${p.x.toFixed(1)} · B: ${p.y.toFixed(1)}`,i,4.8,'#56617c99')}).join('')}</g><path class="science-trend regression-line" pathLength="1" d="M${x(5)},${g.y(intercept+slope*5)}L${x(95)},${g.y(intercept+slope*95)}" stroke="#e59b22" stroke-width="2.4" fill="none"/></svg>`;
 document.querySelector('#correlation-score').textContent='R² = '+r2.toFixed(2);bindTooltip(root);
 const compareRoot=document.querySelector('#comparison-plot'),a=[88,59,40,44,41,57,43,78,91,55,19,34],b=[64,47,54,32,17,28,33,46,77,70,47,47],cw=565,ch=365,cg=grid({w:cw,h:ch,left:53,right:22,top:20,bottom:58,xTicks:12,xTitle:'Cortes de seguimiento',yTitle:'Índice ilustrativo'});
 compareRoot.innerHTML=`<svg viewBox="0 0 ${cw} ${ch}" role="group" aria-label="Comparación de dos series ficticias durante doce cortes">${cg.body}${[a,b].map((values,k)=>`<g class="comparison-series" data-science-series="${k}"><path class="science-trend" pathLength="1" d="${line(values.map((v,i)=>[cg.x(i),cg.y(v)]))}" fill="none" stroke="${k?'#39afa8':'#bf55ae'}" stroke-width="2.6" stroke-linejoin="round"/>${values.map((v,i)=>dot(cg.x(i),cg.y(v),k?'#39afa8':'#bf55ae',`Serie ${k?'B':'A'} · Corte ${i+1}: ${v}`,i,5)).join('')}</g>`).join('')}</svg>`;bindTooltip(compareRoot);
 document.querySelectorAll('[data-comparison-series]').forEach(button=>button.onclick=()=>{const k=button.dataset.comparisonSeries,group=compareRoot.querySelector(`[data-science-series="${k}"]`),hiding=button.getAttribute('aria-pressed')==='true';const active=[...document.querySelectorAll('[data-comparison-series]')].filter(b=>b.getAttribute('aria-pressed')==='true').length;if(hiding&&active===1)return;button.setAttribute('aria-pressed',String(!hiding));group.classList.toggle('science-series-hidden',hiding);group.querySelectorAll('[data-viz-point]').forEach((p,i)=>p.tabIndex=hiding?-1:i%5===0?0:-1)});
})();
