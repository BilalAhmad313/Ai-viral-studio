// Basic particle background + simple interactive behaviors
(() => {
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let w = canvas.width = innerWidth;
  let h = canvas.height = innerHeight;

  const particles = [];
  const count = Math.round((w * h) / 90000);

  function rand(min, max){ return Math.random() * (max - min) + min }

  function Particle(){
    this.x = rand(0, w);
    this.y = rand(0, h);
    this.vx = rand(-0.25, 0.25);
    this.vy = rand(-0.25, 0.25);
    this.r = rand(0.6, 2.2);
    this.alpha = rand(0.08, 0.35);
  }

  Particle.prototype.update = function(){
    this.x += this.vx;
    this.y += this.vy;
    if(this.x < -10) this.x = w + 10;
    if(this.x > w + 10) this.x = -10;
    if(this.y < -10) this.y = h + 10;
    if(this.y > h + 10) this.y = -10;
  }

  Particle.prototype.draw = function(){
    ctx.beginPath();
    ctx.fillStyle = `rgba(140,92,246, ${this.alpha})`;
    ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
    ctx.fill();
  }

  function init(){
    particles.length = 0;
    for(let i=0;i<count;i++) particles.push(new Particle());
  }

  function loop(){
    ctx.clearRect(0,0,w,h);
    for(let p of particles){ p.update(); p.draw(); }
    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', ()=>{
    w = canvas.width = innerWidth;
    h = canvas.height = innerHeight;
    init();
  });

  init(); loop();

  // Navigation toggle
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');
  navToggle && navToggle.addEventListener('click', ()=>{
    if(nav.style.display === 'flex') nav.style.display = '';
    else nav.style.display = 'flex';
  });

  // Video modal
  const modal = document.getElementById('video-modal');
  const wrapper = document.getElementById('video-wrapper');
  const closeBtn = document.querySelector('.modal-close');

  function openVideo(id){
    wrapper.innerHTML = `<iframe src="https://www.youtube.com/embed/${id}?autoplay=1&rel=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
    modal.setAttribute('aria-hidden','false');
  }
  function closeVideo(){
    wrapper.innerHTML = '';
    modal.setAttribute('aria-hidden','true');
  }

  document.querySelectorAll('.play').forEach(btn=>{
    btn.addEventListener('click', (e)=>{
      const id = btn.dataset.id || btn.getAttribute('data-id');
      openVideo(id);
    });
  });

  document.getElementById('play-sample')?.addEventListener('click', (e)=>{
    e.preventDefault();
    openVideo('dQw4w9WgXcQ');
  });

  closeBtn?.addEventListener('click', closeVideo);
  modal?.addEventListener('click', (e)=>{ if(e.target === modal) closeVideo(); });

  // Smooth scroll for internal links
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', (e)=>{
      const href = a.getAttribute('href');
      if(href.length>1){
        e.preventDefault();
        const el = document.querySelector(href);
        if(el) el.scrollIntoView({behavior:'smooth',block:'start'});
      }
    });
  });

})();
