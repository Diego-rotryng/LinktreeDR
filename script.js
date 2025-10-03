
(async function(){
  const qs = new URLSearchParams(location.search);
  const alias = (location.hostname.split('.').length>2 && location.hostname.split('.')[0] !== 'www')
                ? location.hostname.split('.')[0]
                : (qs.get('c')||'').toLowerCase();

  const profileEl = document.getElementById('profile');
  const dirEl = document.getElementById('directory');
  const dirListEl = document.getElementById('dirList');

  async function loadJSON(path){
    const resp = await fetch(path+'?v='+Date.now());
    if(!resp.ok) throw new Error('No se pudo cargar '+path);
    return resp.json();
  }

  function money(x){ return new Intl.NumberFormat('es-AR',{style:'currency',currency:'ARS', maximumFractionDigits:0}).format(x); }

  function renderProfile(data){
    const card = document.createElement('div');
    card.className = 'card';

    const header = document.createElement('div');
    header.className = 'header';

    const avatar = document.createElement('img');
    avatar.className = 'avatar';
    avatar.src = data.avatar || 'img/avatar_placeholder.svg';
    avatar.alt = data.nombre;

    const hwrap = document.createElement('div');
    const title = document.createElement('h1');
    title.className='title';
    title.textContent = data.nombre;
    const subtitle = document.createElement('div');
    subtitle.className='subtitle';
    subtitle.textContent = data.subtitulo || '';

    const chips = document.createElement('div');
    chips.className='chips';
    (data.tags||[]).forEach(t=>{
      const chip = document.createElement('span'); chip.className='chip'; chip.textContent=t; chips.appendChild(chip);
    });

    hwrap.appendChild(title); hwrap.appendChild(subtitle); hwrap.appendChild(chips);
    header.appendChild(avatar); header.appendChild(hwrap);

    const ctas = document.createElement('div');
    ctas.className = 'ctas';
    if(data.whatsapp){
      const a = document.createElement('a');
      a.href = 'https://wa.me/'+data.whatsapp.replace(/\D/g,'')+(data.whatsappMsg?`?text=${encodeURIComponent(data.whatsappMsg)}`:'');
      a.className='btn btn-primary'; a.target='_blank'; a.rel='noopener';
      a.textContent = 'Escribime por WhatsApp';
      ctas.appendChild(a);
    }
    if(data.instagram){
      const a = document.createElement('a');
      a.href = data.instagram; a.target='_blank'; a.rel='noopener'; a.className='btn btn-dark';
      a.textContent = 'Instagram'; ctas.appendChild(a);
    }
    if(data.reservar){
      const a = document.createElement('a');
      a.href = data.reservar; a.target='_blank'; a.rel='noopener'; a.className='btn btn-dark';
      a.textContent = 'Reservar'; ctas.appendChild(a);
    }
    if(data.pagar){
      const a = document.createElement('a');
      a.href = data.pagar; a.target='_blank'; a.rel='noopener'; a.className='btn btn-accent';
      a.textContent = 'Pagar ahora'; ctas.appendChild(a);
    }

    // Destacados
    if((data.destacados||[]).length){
      const sec = document.createElement('div'); sec.className='section';
      sec.innerHTML = '<h3>Destacados</h3>';
      const list = document.createElement('div'); list.className='list';
      data.destacados.forEach(d=>{
        const it = document.createElement('div'); it.className='item';
        const left = document.createElement('div'); left.className='item-title';
        const emoji = document.createElement('span'); emoji.className='emoji'; emoji.textContent = d.emoji || '⭐';
        const label = document.createElement('div'); label.innerHTML = `<strong>${d.titulo}</strong> ${d.precio?`— ${money(d.precio)}`:''}`;
        left.appendChild(emoji); left.appendChild(label);
        const actions = document.createElement('div'); actions.className='item-actions';
        if(d.whatsText){
          const b = document.createElement('a'); b.className='btn btn-primary'; b.textContent='Elegir';
          b.href = 'https://wa.me/'+data.whatsapp.replace(/\D/g,'')+'?text='+encodeURIComponent(d.whatsText); b.target='_blank';
          actions.appendChild(b);
        }
        it.appendChild(left); it.appendChild(actions); list.appendChild(it);
      });
      sec.appendChild(list); card.appendChild(sec);
    }

    // Enlaces como botones a la derecha
    if((data.enlaces||[]).length){
      const sec = document.createElement('div'); sec.className='section';
      sec.innerHTML = '<h3>Enlaces</h3>';
      const list = document.createElement('div'); list.className='list';
      data.enlaces.forEach(e=>{
        const it = document.createElement('div'); it.className='item';
        const left = document.createElement('div'); left.className='item-title';
        const emoji = document.createElement('span'); emoji.className='emoji'; emoji.textContent = e.emoji || '🔗';
        const label = document.createElement('div'); label.textContent = e.titulo || e.url;
        left.appendChild(emoji); left.appendChild(label);
        const actions = document.createElement('div'); actions.className='item-actions';
        const open = document.createElement('a'); open.className='btn btn-outline'; open.target='_blank'; open.href=e.url; open.textContent='Abrir';
        actions.appendChild(open);
        it.appendChild(left); it.appendChild(actions); list.appendChild(it);
      });
      sec.appendChild(list); card.appendChild(sec);
    }

    if(data.nota){ const p=document.createElement('div'); p.className='note'; p.textContent=data.nota; card.appendChild(p); }
    card.appendChild(document.createElement('footer')).innerHTML = 'Demo Einstech · subdominios wildcard activos';
    profileEl.appendChild(card);
  }

  try{
    if(alias){
      const data = await loadJSON('clientes/'+alias+'.json');
      renderProfile(data);
    }else{
      const list = await loadJSON('clientes/_list.json');
      dirEl.classList.remove('hidden');
      const input = document.getElementById('search');
      const render = () => {
        dirListEl.innerHTML='';
        const q = (input.value||'').toLowerCase();
        list.filter(x=>(x.nombre+' '+x.rubro+' '+x.alias).toLowerCase().includes(q)).forEach(r=>{
          const card = document.createElement('a');
          card.className='dir-card';
          const url = (location.hostname.split('.').length>2 && !location.hostname.includes('vercel.app'))
                      ? 'https://'+r.alias+'.'+location.hostname.split('.').slice(-3).join('.')
                      : ('?c='+r.alias);
          card.href = url;
          card.innerHTML = `<img src="${r.avatar||'img/avatar_placeholder.svg'}" alt="">
                            <div class="meta">
                              <strong>${r.nombre}</strong>
                              <span class="alias">${r.rubro} · ${r.alias}</span>
                            </div>`;
          dirListEl.appendChild(card);
        });
      };
      input.addEventListener('input', render);
      render();
    }
  }catch(err){
    profileEl.innerHTML = '<div class="card"><h2>Perfil no encontrado</h2><p>Verificá el alias o parámetro <code>?c=</code>.</p></div>';
  }
})();
