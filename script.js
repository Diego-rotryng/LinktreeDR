async function init(){
  const sub = location.hostname.split('.')[0];
  try {
    const res = await fetch(`clientes/${sub}.json`);
    if(!res.ok) throw new Error("No encontrado");
    const c = await res.json();
    document.body.innerHTML = `<h1>${c.nombre}</h1>
      <p>${c.profesion}</p>
      <a href='https://wa.me/${c.wa_numero}?text=${encodeURIComponent(c.wa_mensaje)}'>WhatsApp</a>`;
  } catch (e) {
    document.body.innerHTML = `<h1>Perfil no encontrado</h1>`;
  }
}
init();