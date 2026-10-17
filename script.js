const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.site-nav');
const navLinks = [...document.querySelectorAll('.site-nav a')];
const sections = [...document.querySelectorAll('main section[id]')];
const progressBar = document.querySelector('.page-progress span');

function closeMenu() {
  navigation.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('menu-open');
}

menuButton.addEventListener('click', () => {
  const open = !navigation.classList.contains('open');
  navigation.classList.toggle('open', open);
  menuButton.setAttribute('aria-expanded', String(open));
  document.body.classList.toggle('menu-open', open);
});

navLinks.forEach(link => link.addEventListener('click', closeMenu));

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-visible');
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.12, rootMargin: '0px 0px -45px' });

document.querySelectorAll('.reveal').forEach(item => revealObserver.observe(item));

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
  });
}, { rootMargin: '-38% 0px -55%', threshold: 0 });

sections.forEach(section => sectionObserver.observe(section));

document.querySelectorAll('.entry-toggle').forEach(button => {
  button.addEventListener('click', () => {
    const entry = button.closest('.journal-entry');
    const open = entry.classList.toggle('open');
    button.setAttribute('aria-expanded', String(open));
    button.textContent = open ? 'Close entry' : button.dataset.label || 'Read reflection';
  });
  button.dataset.label = button.textContent;
});

function updateProgress() {
  const total = document.documentElement.scrollHeight - innerHeight;
  progressBar.style.width = `${total > 0 ? Math.min(100, scrollY / total * 100) : 0}%`;
}

addEventListener('scroll', updateProgress, { passive: true });
updateProgress();
document.getElementById('year').textContent = new Date().getFullYear();

const faithAudio=document.querySelector('#faith-audio');
const musicButton=document.querySelector('#music-toggle');
const musicVolume=document.querySelector('#music-volume');
let musicRequest=0;
const termTracks={prelims:{src:'assets/ready-for-it.mp3',title:'…Ready For It?'},midterms:{src:'assets/expectations.mp3',title:'expectations'}};
faithAudio.volume=.4;
function playTermMusic(){const request=++musicRequest;faithAudio.play().then(()=>{if(request===musicRequest)document.querySelector('#music-message').textContent='';}).catch(()=>{if(request===musicRequest)document.querySelector('#music-message').textContent='Press Play to start music.';});}
function syncMusic(term,play){const track=termTracks[term];if(faithAudio.getAttribute('src')!==track.src){++musicRequest;faithAudio.pause();faithAudio.setAttribute('src',track.src);faithAudio.load();}document.querySelector('#music-title').textContent=track.title;document.querySelector('#music-term').textContent=term.toUpperCase()+' SOUNDTRACK';if(play)playTermMusic();}
function updateMusicButton(){musicButton.textContent=faithAudio.paused?'Play ▶':'Pause Ⅱ';musicButton.setAttribute('aria-pressed',String(!faithAudio.paused));musicButton.setAttribute('aria-label',faithAudio.paused?'Play soundtrack':'Pause soundtrack');}
musicButton.addEventListener('click',()=>{if(faithAudio.paused)playTermMusic();else{++musicRequest;faithAudio.pause();}});faithAudio.addEventListener('play',updateMusicButton);faithAudio.addEventListener('pause',updateMusicButton);musicVolume.addEventListener('input',()=>faithAudio.volume=Number(musicVolume.value)/100);

const termButtons=[...document.querySelectorAll('[data-choose-term]')];
function chooseTerm(term,write=true){
 if(!['prelims','midterms'].includes(term))term='midterms';
 syncMusic(term,write);
 document.querySelectorAll('[data-term]').forEach(p=>p.hidden=p.dataset.term!==term);
 termButtons.forEach(b=>{const active=b.dataset.chooseTerm===term;b.setAttribute('aria-selected',String(active));b.tabIndex=active?0:-1});
 document.querySelector('.term-announcement').textContent=`Viewing ${term==='midterms'?'Midterms':'Prelims'} · 2026`;
 navLinks.forEach(link=>{const base=link.getAttribute('href').replace('-midterms','');if(['#experiences','#learning','#reflection'].includes(base))link.setAttribute('href',term==='midterms'?base+'-midterms':base)});
 document.querySelectorAll('.reveal').forEach(e=>revealObserver.observe(e));
 updateProgress();
 if(write){const url=new URL(location.href);url.searchParams.set('term',term);history.replaceState(null,'',url)}
}
termButtons.forEach((b,i)=>{
 b.addEventListener('click',()=>chooseTerm(b.dataset.chooseTerm));
 b.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const n=e.key==='Home'?0:e.key==='End'?1:1-i;chooseTerm(termButtons[n].dataset.chooseTerm);termButtons[n].focus()});
});
chooseTerm(new URLSearchParams(location.search).get('term'),false);
window.addEventListener('popstate',()=>chooseTerm(new URLSearchParams(location.search).get('term'),false));
document.querySelectorAll('.faith-chapter').forEach(card=>card.addEventListener('toggle',()=>{if(card.open)document.querySelectorAll('.faith-chapter[open]').forEach(other=>{if(other!==card)other.open=false})}));
const lightbox=document.querySelector('.faith-lightbox');
document.querySelectorAll('.photo-open').forEach(button=>button.addEventListener('click',()=>{const img=lightbox.querySelector('img');img.src=button.dataset.photo;img.alt=button.querySelector('img').alt;lightbox.showModal()}));
lightbox.querySelector('.photo-close').addEventListener('click',()=>lightbox.close());
lightbox.addEventListener('click',e=>{if(e.target===lightbox)lightbox.close()});
