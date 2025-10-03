
const FALLBACK_AVATAR = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAxMjggMTI4Jz4KPGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSdnJyB4MT0nMCcgeDI9JzEnPjxzdG9wIHN0b3AtY29sb3I9JyMzMzQxNTUnLz48c3RvcCBvZmZzZXQ9JzEnIHN0b3AtY29sb3I9JyMwZjE3MmEnLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz4KPHJlY3Qgd2lkdGg9JzEyOCcgaGVpZ2h0PScxMjgnIGZpbGw9J3VybCgjZyknLz4KPGNpcmNsZSBjeD0nNjQnIGN5PSc0Nicgcj0nMjYnIGZpbGw9JyNlMmU4ZjAnLz4KPHJlY3QgeD0nMjAnIHk9JzgwJyB3aWR0aD0nODgnIGhlaWdodD0nNDAnIHJ4PScyMCcgZmlsbD0nI2UyZThmMCcvPgo8L3N2Zz4=";

function icon(name){ // minimal emoji icons
  const map = {
    ig:"📷", web:"🌐", pagar:"💳", reservar:"📅", wa:"💬", link:"🔗", shop:"🛒", video:"🎬"
  }; return map[name]||"🔗";
}

function a(href, label, cls="btn"){return `<a target="_blank" rel="noopener" href="${href}" class="${cls}">${label}</a>`}

async function init(){ 
  let key = (location.hostname||"").split(".")[0];
  const q = new URLSearchParams(location.search);
  if(q.get("c")) key = q.get("c").toLowerCase();

  if(!key || key === "localhost" || key.includes(":") || key === "file"){ // local selector
    try{
      const res = await fetch("clientes/_list.json"); const list = await res.json();
      document.getElementById("title").innerText = "Elegí un demo";
      document.getElementById("subtitle").innerHTML = "Usá ?c=nombre en la URL.";
      document.getElementById("avatar").src = FALLBACK_AVATAR;
      const links = list.map(k => a(`?c=${k}`, "Abrir " + k, "btn")).join(" ");
      document.getElementById("links").innerHTML = links;
      document.getElementById("highlights").innerHTML = "";
      return;
    }catch(e){/*ignore*/}
  }

  try{
    const res = await fetch(`clientes/${key}.json`);
    if(!res.ok) throw new Error("no json");
    const c = await res.json();
    document.getElementById("title").innerText = c.nombre || key;
    document.getElementById("subtitle").innerText = c.profesion || "";
    document.getElementById("avatar").src = c.avatar || FALLBACK_AVATAR;

    // badges
    document.getElementById("badges").innerHTML = (c.tags||[]).map(t=>`<span class='badge'>${t}</span>`).join("");

    // primary WhatsApp
    let waUrl = c.wa_numero ? `https://wa.me/${c.wa_numero}?text=${encodeURIComponent(c.wa_mensaje||"Hola!")}` : null;
    const ctas = [];
    if(waUrl) ctas.push(a(waUrl, icon("wa")+" Escribime por WhatsApp","btn whatsapp"));
    if(c.instagram) ctas.push(a(c.instagram, icon("ig")+" Instagram"));
    if(c.reservar_url) ctas.push(a(c.reservar_url, icon("reservar")+" Reservar"));
    if(c.pagar_url) ctas.push(a(c.pagar_url, icon("pagar")+" Pagar ahora"));
    document.getElementById("cta").innerHTML = ctas.join("");

    // destacados
    document.getElementById("highlights").innerHTML = (c.destacados||[]).map(d=>{
      const txt = d.mensaje || `Hola, quiero ${d.titulo}`;
      const href = waUrl ? `https://wa.me/${c.wa_numero}?text=${encodeURIComponent(txt)}` : (c.pagar_url||"#");
      const price = d.precio ? ` – $${d.precio}` : "";
      return `<div class="chip">${d.titulo}${price}<div style="margin-top:8px">${a(href,"Elegir", "btn")}</div></div>`;
    }).join("");

    // links extra
    document.getElementById("links").innerHTML = (c.links||[]).map(l=>`<div class="chip">${a(l.url, (icon(l.icon||"link")+" "+(l.label||l.url)), "btn")}</div>`).join("");

    // footer
    document.getElementById("foot").innerText = c.footer || "Demo Einstech · subdominios wildcard activos";
  }catch(e){
    document.getElementById("title").innerText = "Perfil no encontrado";
    document.getElementById("subtitle").innerHTML = "Probá con <code>?c=clarisa</code> o confirmá el JSON.";
    document.getElementById("avatar").src = FALLBACK_AVATAR;
  }
}
init();
