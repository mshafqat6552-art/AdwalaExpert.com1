window.addEventListener('load',()=>{
  document.getElementById('preloader').classList.add('done');
  document.body.classList.add('loaded');
});
const nav=document.getElementById('siteNav');
window.addEventListener('scroll',()=>{nav.classList.toggle('scrolled',window.scrollY>40);});
const mt=document.getElementById('menuToggle'), mm=document.getElementById('mobileMenu'), mc=document.getElementById('menuClose');
mt.addEventListener('click',()=>mm.classList.add('open'));
mc.addEventListener('click',()=>mm.classList.remove('open'));
mm.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>mm.classList.remove('open')));
const obs=new IntersectionObserver((entries)=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');obs.unobserve(e.target);}})},{threshold:.12});
document.querySelectorAll('.reveal,.reveal-stagger').forEach(el=>obs.observe(el));

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const countObs=new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(!entry.isIntersecting) return;
    entry.target.querySelectorAll('.count').forEach(el=>{
      const target=parseInt(el.dataset.target,10);
      const suffix=el.dataset.suffix||'';
      if(reduceMotion){el.textContent=target+suffix;return;}
      let start=null; const duration=1400;
      function step(ts){
        if(!start) start=ts;
        const progress=Math.min((ts-start)/duration,1);
        const eased=1-Math.pow(1-progress,3);
        el.textContent=Math.round(eased*target)+suffix;
        if(progress<1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
    countObs.unobserve(entry.target);
  });
},{threshold:.4});
const statGrid=document.getElementById('statGrid');
if(statGrid) countObs.observe(statGrid);

/* Testimonials carousel */
(function(){
  const track=document.getElementById('testiTrack');
  const slides=track ? track.querySelectorAll('.testi-slide') : [];
  const dotsWrap=document.getElementById('testiDots');
  const prevBtn=document.getElementById('testiPrev');
  const nextBtn=document.getElementById('testiNext');
  if(!track || !slides.length) return;
  let idx=0;
  slides.forEach((_,i)=>{
    const d=document.createElement('button');
    if(i===0) d.classList.add('active');
    d.setAttribute('aria-label','Go to review '+(i+1));
    d.addEventListener('click',()=>{goTo(i);resetAuto();});
    dotsWrap.appendChild(d);
  });
  const dots=dotsWrap.querySelectorAll('button');
  function render(){
    track.style.transform='translateX(-'+(idx*100)+'%)';
    dots.forEach((d,i)=>d.classList.toggle('active',i===idx));
  }
  function goTo(i){ idx=(i+slides.length)%slides.length; render(); }
  prevBtn.addEventListener('click',()=>{goTo(idx-1);resetAuto();});
  nextBtn.addEventListener('click',()=>{goTo(idx+1);resetAuto();});
  let autoTimer;
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function startAuto(){ if(reduce) return; autoTimer=setInterval(()=>goTo(idx+1),4500); }
  function resetAuto(){ clearInterval(autoTimer); startAuto(); }
  const carousel=document.getElementById('testiCarousel');
  carousel.addEventListener('mouseenter',()=>clearInterval(autoTimer));
  carousel.addEventListener('mouseleave',startAuto);
  render();
  startAuto();
})();

const cf=document.getElementById('contactForm');
if(cf){
  cf.addEventListener('submit',function(e){
    e.preventDefault();
    const name=document.getElementById('cf-name').value.trim();
    const email=document.getElementById('cf-email').value.trim();
    const service=document.getElementById('cf-service').value;
    const company=document.getElementById('cf-company').value.trim();
    const message=document.getElementById('cf-message').value.trim();
    let text=`New website inquiry:%0A%0AName: ${encodeURIComponent(name)}%0AEmail: ${encodeURIComponent(email)}%0AService: ${encodeURIComponent(service)}%0ACompany: ${encodeURIComponent(company||'-')}%0AMessage: ${encodeURIComponent(message)}`;
    const waUrl=`https://wa.me/923235437518?text=${text}`;
    window.open(waUrl,'_blank');
    const btn=cf.querySelector('.cta-btn');
    btn.textContent='Opening WhatsApp…';
    setTimeout(()=>{btn.textContent='Send via WhatsApp';},3000);
  });
}
