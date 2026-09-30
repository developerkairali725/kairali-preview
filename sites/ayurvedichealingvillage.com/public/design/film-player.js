/* A click-to-load player shared by the homepage and video gallery.
   Provider requests start only after an explicit play action. Links still work without JS. */
(function(){
 if(window.__ahvFilmPlayerBound)return;
 window.__ahvFilmPlayerBound=true;
 var dialog, slot, heading, external, trigger, scrollOverflow, paused=[];
 function create(){
  dialog=document.createElement('dialog');dialog.className='ahv-film-dialog';dialog.setAttribute('aria-labelledby','ahv-film-heading');
  dialog.innerHTML='<div class="ahv-film-top"><h2 id="ahv-film-heading"></h2><button type="button" aria-label="Close video" autofocus>Close <span aria-hidden="true">×</span></button></div><div class="ahv-film-screen"></div><div class="ahv-film-bottom"><a class="ahv-film-youtube" target="_blank" rel="noopener noreferrer">Open on YouTube ↗</a><a href="/video-gallery/">Browse all videos →</a></div>';
  document.body.appendChild(dialog);slot=dialog.querySelector('.ahv-film-screen');heading=dialog.querySelector('h2');external=dialog.querySelector('.ahv-film-youtube');
  dialog.querySelector('button').addEventListener('click',function(){dialog.close();});
  dialog.addEventListener('click',function(e){if(e.target===dialog)dialog.close();});
  dialog.addEventListener('close',function(){slot.replaceChildren();document.documentElement.style.overflow=scrollOverflow;paused.forEach(function(v){if(v.isConnected)v.play().catch(function(){});});paused=[];if(trigger&&trigger.isConnected)trigger.focus({preventScroll:true});});
 }
 document.addEventListener('click',function(e){
  var link=e.target.closest&&e.target.closest('[data-ahv-film]');if(!link||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
  var id=link.getAttribute('data-ahv-film');if(id!=='village-glimpse'&&!/^[A-Za-z0-9_-]{11}$/.test(id))return;
  if(!window.HTMLDialogElement)return;
  e.preventDefault();if(!dialog)create();if(dialog.open)return;
  trigger=link;heading.textContent=link.getAttribute('data-film-title')||'Kairali film';
  var player;
  if(id==='village-glimpse'){
   player=document.createElement('video');player.src='/ahv/assets/video/8eae55f0d654b6f413a3aed586aacd06df2f140baf8982e86fd1c3eaf656fffa.mp4';player.controls=true;player.autoplay=true;player.playsInline=true;player.setAttribute('aria-label',heading.textContent);external.hidden=true;
  }else{
   player=document.createElement('iframe');player.src='https://www.youtube-nocookie.com/embed/'+id+'?autoplay=1&playsinline=1&rel=0';player.title=heading.textContent;player.allow='autoplay; encrypted-media; fullscreen; picture-in-picture';player.allowFullscreen=true;player.referrerPolicy='strict-origin-when-cross-origin';external.href='https://www.youtube.com/watch?v='+id;external.hidden=false;
  }
  paused=Array.from(document.querySelectorAll('video')).filter(function(v){return !v.paused;});paused.forEach(function(v){v.pause();});slot.replaceChildren(player);scrollOverflow=document.documentElement.style.overflow;document.documentElement.style.overflow='hidden';dialog.showModal();
 },true);
})();
