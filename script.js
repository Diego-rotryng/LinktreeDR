// BioExpress — render dinámico por subdominio o ?c=
async function loadJSON(path){ const res = await fetch(path, {cache:"no-store"}); if(!res.ok) throw new Error("No se pudo cargar "+path); return res.json(); }

function getAlias() {
  const url = new URL(window.location.href);
  const c = url.searchParams.get("c");
  if (c) return c.toLowerCase();
  const host = window.location.hostname; // subdominio.einstech.com.ar
  const parts = host.split(".");
  if (parts.length >= 3) return parts[0].toLowerCase();
  return null;
}

function waLink(num,msg){
  const base = num.startsWith("http") ? num : ("https://wa.me/"+num.replace(/[^0-9]/g,""));
  if(!msg) return base;
  return base + "?text=" + encodeURIComponent(msg);
}

function icon(name){
  const map = {
    web:"🌐", calendar:"📅", store:"🛒", maps:"📍", tiktok:"🎵", facebook:"📘", x:"✖️",
    linkedin:"🔗", youtube:"▶️", instagram:"📸", pdf:"📄", mail:"✉️"
  };
  return map[name] || "🔗";
}

function $el(html){ const div=document.createElement('div'); div.innerHTML=html.trim(); return div.firstChild; }

function renderProfile(data){
  const root = document.getElementById("profile");
  root.style.display="block";

  const img = data.avatar || "img/avatar_placeholder.svg";
  const tags = (data.tags||[]).map(t=>`<span class="tag">${t}</span>`).join("");

  const wa = data.wa_numero ? `<a class="btn wa" href="${waLink(data.wa_numero, data.wa_mensaje||'Hola!')}" target="_blank">💬 Escribime por WhatsApp</a>` : "";
  const ig = data.instagram ? `<a class="btn ig" href="${data.instagram}" target="_blank">📸 Instagram</a>` : "";
  const reservar = data.reservar_url ? `<a class="btn" href="${data.reservar_url}" target="_blank">📅 Reservar</a>` : "";
  const pagar = data.pagar_url ? `<a class="btn" href="${data.pagar_url}" target="_blank">💳 Pagar ahora</a>` : "";

  root.innerHTML = `
    <div class="header">
      <div class="avatar"><img src="${img}" alt="avatar"></div>
      <div class="title">
        <h1>${data.nombre||'Sin nombre'}</h1>
        <div>${data.profesion||''}</div>
        <div class="tags">${tags}</div>
      </div>
    </div>
    <div class="cta">${wa}${ig}${reservar}${pagar}</div>

    ${ (data.destacados && data.destacados.length) ? `
    <div class="section">
      <h3>Destacados</h3>
      <div class="list">
        ${data.destacados.map(d=>`
          <div class="item">
            <div>
              <div class="primary">${d.titulo||''}</div>
              ${d.precio?`<div class="small">$${Number(d.precio).toLocaleString('es-AR')}</div>`:''}
            </div>
            <div class="actions">
              <a target="_blank" href="${waLink(data.wa_numero||'', d.mensaje || d.titulo || '')}">Elegir</a>
            </div>
          </div>`).join('')}
      </div>
    </div>`:''}

    ${(data.links && data.links.length) ? `
    <div class="section">
      <h3>Enlaces</h3>
      <div class="links">
        ${data.links.map(l=>`
          <div class="link">
            <div>${icon(l.icon)} ${l.label}</div>
            <a target="_blank" href="${l.url}">Abrir</a>
          </div>`).join('')}
      </div>
    </div>`:''}

    <div class="footer">${data.footer||''}</div>
  `;
}

function renderDirectory(list){
  const wrap = document.getElementById("directory");
  const grid = document.getElementById("dirGrid");
  wrap.style.display="block";
  const draw = (items)=>{
    grid.innerHTML = items.map(it=>`
      <div class="dir-item">
        <h4>${it.nombre}</h4>
        <div class="small">@${it.alias} · ${it.rubro||''}</div>
        <div style="margin-top:10px;display:flex;gap:8px;flex-wrap:wrap">
          <a class="btn" href="?c=${it.alias}">Abrir aquí</a>
          <a class="btn" href="https://${it.alias}.einstech.com.ar" target="_blank">Wildcard</a>
        </div>
      </div>`).join('');
  };
  draw(list);
  document.getElementById("q").addEventListener("input", e=>{
    const q = e.target.value.toLowerCase();
    const f = list.filter(x => (x.nombre+' '+x.alias+' '+(x.rubro||'')).toLowerCase().includes(q));
    draw(f);
  });
}

(async function main(){
  try{
    const alias = getAlias();
    const reg = await loadJSON("clientes/_list.json");
    if(alias){
      const path = `clientes/${alias}.json`;
      try{
        const data = await loadJSON(path);
        renderProfile(data);
      }catch(e){
        // si falla alias por subdominio, mostramos directorio
        renderDirectory(reg);
      }
    }else{
      renderDirectory(reg);
    }
  }catch(err){
    console.error(err);
  }
})();