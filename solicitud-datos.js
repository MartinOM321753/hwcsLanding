'use strict';
(()=>{
 const form=document.querySelector('#data-request-form');if(!form)return;
 const purpose=document.querySelector('#request-purpose'),purposeWrap=document.querySelector('#purpose-other-wrap'),purposeOther=document.querySelector('#purpose-other');
 const otherProduct=document.querySelector('#product-other-check'),otherProductWrap=document.querySelector('#product-other-wrap'),otherProductText=document.querySelector('#product-other'),undefinedProduct=document.querySelector('#product-undefined');
 const productError=document.querySelector('#product-error'),status=document.querySelector('#data-submit-status');
 const sections=[...form.querySelectorAll('.data-form-section')],steps=[...form.querySelectorAll('[data-step-item]')];
 const currentLabel=document.querySelector('#data-progress-current'),back=form.querySelector('.data-step-back'),next=form.querySelector('.data-step-next'),submit=form.querySelector('.data-submit');
 const footerNotes=[...form.querySelectorAll('.data-step-footer-note')];
 let activeStep=0;
 const syncPurpose=()=>{const show=purpose.value==='other';purposeWrap.hidden=!show;purposeOther.required=show;if(!show)purposeOther.value=''};
 const syncOtherProduct=()=>{const show=otherProduct.checked;otherProductWrap.hidden=!show;otherProductText.required=show;if(!show)otherProductText.value=''};
 const updateProgress=()=>{
   const english=document.documentElement.lang==='en';
   sections.forEach((section,index)=>{section.hidden=index!==activeStep});
   steps.forEach((step,index)=>{if(index===activeStep)step.setAttribute('aria-current','step');else step.removeAttribute('aria-current');step.classList.toggle('is-complete',index<activeStep)});
   currentLabel.textContent=english?`Step ${activeStep+1} of 3 · ${['Applicant details','Project','Academic product'][activeStep]}`:`Paso ${activeStep+1} de 3 · ${['Datos personales','Proyecto','Producto académico'][activeStep]}`;
   back.hidden=activeStep===0;next.hidden=activeStep===sections.length-1;submit.hidden=activeStep!==sections.length-1;
   footerNotes.forEach(note=>note.hidden=activeStep!==sections.length-1);
 };
 const goToStep=(index,focus=true)=>{
   activeStep=Math.max(0,Math.min(sections.length-1,index));updateProgress();
   if(focus){const heading=sections[activeStep].querySelector('.data-form-heading h2');heading.setAttribute('tabindex','-1');heading.focus({preventScroll:true});sections[activeStep].scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'center'})}
 };
 const validateSection=index=>{
   const invalid=[...sections[index].querySelectorAll('input,select,textarea')].find(control=>!control.checkValidity());
   if(!invalid)return true;
   invalid.reportValidity();return false;
 };
 purpose.addEventListener('change',syncPurpose);otherProduct.addEventListener('change',syncOtherProduct);
 back.addEventListener('click',()=>goToStep(activeStep-1));
 next.addEventListener('click',()=>{if(validateSection(activeStep))goToStep(activeStep+1)});
 form.querySelectorAll('input[name="products"]').forEach(input=>input.addEventListener('change',()=>{
   if(input===undefinedProduct&&input.checked)form.querySelectorAll('input[name="products"]').forEach(other=>{if(other!==undefinedProduct)other.checked=false});
   else if(input.checked&&undefinedProduct.checked)undefinedProduct.checked=false;
   productError.hidden=form.querySelectorAll('input[name="products"]:checked').length>0;syncOtherProduct();
 }));
 form.addEventListener('submit',event=>{
   event.preventDefault();
   const products=[...form.querySelectorAll('input[name="products"]:checked')];
   if(!products.length){productError.hidden=false;form.querySelector('input[name="products"]')?.focus();return}
   productError.hidden=true;
   const invalidIndex=sections.findIndex((section,index)=>[...section.querySelectorAll('input,select,textarea')].some(control=>!control.checkValidity()));
   if(invalidIndex!==-1){goToStep(invalidIndex);validateSection(invalidIndex);return}
   const english=document.documentElement.lang==='en';
   const values=new FormData(form),labels=english?{
     subject:'Request for access to the Health Workers Cohort Study database',name:'Applicant',organization:'Institution or organization',email:'Contact email',purpose:'Purpose',project:'Project or intended use',information:'Requested information',products:'Planned academic products',other:'Other',
     ready:'Your email app should open with the request details. Review the message and send it to the Cohort team.',purposeOther:'Other purpose',productOther:'Other product'
   }:{
     subject:'Solicitud de acceso a la base de datos de la Cohorte',name:'Nombre completo',organization:'Institución u organización de adscripción',email:'Correo electrónico de contacto',purpose:'Propósito de la solicitud',project:'Proyecto o propósito',information:'Información de interés',products:'Publicaciones o productos previstos',other:'Otro',
     ready:'Se abrirá tu aplicación de correo con los datos de la solicitud. Revísalos y envía el mensaje al equipo de la Cohorte.',purposeOther:'Otro propósito',productOther:'Otro producto'
   };
   const selectedPurpose=purpose.selectedOptions[0]?.textContent.trim()||'';
   const selectedProducts=products.map(input=>input.closest('label').querySelector('span').textContent.trim());
   const lines=[labels.name+': '+values.get('fullName'),labels.organization+': '+values.get('organization'),labels.email+': '+values.get('email'),labels.purpose+': '+(purpose.value==='other'?values.get('purposeOther'):selectedPurpose),labels.project+': '+values.get('project'),labels.information+': '+values.get('requestedInformation'),labels.products+': '+selectedProducts.join(', ')];
   if(purpose.value==='other')lines.push(labels.purposeOther+': '+values.get('purposeOther'));
   if(otherProduct.checked)lines.push(labels.productOther+': '+values.get('productOther'));
   const href='mailto:cohorteuiess@gmail.com?subject='+encodeURIComponent(labels.subject)+'&body='+encodeURIComponent(lines.join('\n\n'));
   status.textContent=labels.ready;window.location.href=href;
 });
 new MutationObserver(records=>{if(records.some(record=>record.attributeName==='lang'))updateProgress()}).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
 syncPurpose();syncOtherProduct();updateProgress();
})();
