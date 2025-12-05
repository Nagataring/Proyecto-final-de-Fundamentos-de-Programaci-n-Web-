
const translations = {
  "es": {
    "title":"Taller Navarro Dava",
    "welcome":"Bienvenido a Taller Navarro Dava",
    "description":"Controla el avance de las reparaciones desde tu cuenta."
  },
  "en": {
    "title":"Navarro Dava Workshop",
    "welcome":"Welcome to Navarro Dava Workshop",
    "description":"Track repair progress from your account."
  }
};

function applyLang(lang){
  document.querySelectorAll("[data-i18n]").forEach(el=>{
    const key = el.dataset.i18n;
    el.textContent = translations[lang][key] || el.textContent;
  });
  localStorage.setItem("lang", lang);
}


(function(){
  const s = document.createElement("script");
  s.src = "https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js";
  s.onload = () => {
    emailjs.init("at4COWsdEgfb7bSTG"); 
  };
  document.head.appendChild(s);
})();


document.addEventListener("DOMContentLoaded",()=>{

  const storedLang = localStorage.getItem("lang") || "es";
  const langSwitch = document.getElementById("langSwitch");
  if(langSwitch) langSwitch.value = storedLang;
  applyLang(storedLang);

  if(langSwitch){
    langSwitch.addEventListener("change", e=>{
      applyLang(e.target.value);
    });
  }

  
  document.querySelectorAll(".btn-back").forEach(btn=>{
    btn.addEventListener("click",(e)=>{
      e.preventDefault();
      history.back();
    });
  });

  
  if(document.querySelector("[data-require-login]")){
    if(!localStorage.getItem("isLogged")){
      window.location.href = "login.html";
    }
  }

  /* --------------- LOGIN --------------- */
  const loginForm = document.getElementById("loginForm");
  if(loginForm){
    loginForm.addEventListener("submit",(e)=>{
      e.preventDefault();
      const email = loginForm.email.value;
      const pass = loginForm.password.value;

      const users = JSON.parse(localStorage.getItem("users")||"[]");
      const found = users.find(u=>u.email===email && u.password===pass);

      if(found){
        localStorage.setItem("isLogged","1");
        localStorage.setItem("currentUser",JSON.stringify(found));
        window.location.href = "dashboard.html";
      }else{
        alert("Usuario o contraseña incorrectos.");
      }
    });
  }


  const regForm = document.getElementById("registerForm");
  if(regForm){
    regForm.addEventListener("submit",(e)=>{
      e.preventDefault();

      const name = regForm.name.value;
      const email = regForm.email.value;
      const password = regForm.password.value;

      const users = JSON.parse(localStorage.getItem("users")||"[]");

      if(users.find(u=>u.email===email)){
        alert("Este correo ya está registrado.");
        return;
      }

      users.push({name,email,password});
      localStorage.setItem("users", JSON.stringify(users));

      emailjs.send(
        "service_4sk695p",
        "template_ywvwe7v",
        { name, email }
      );

      alert("Registro exitoso. Ya puedes iniciar sesión.");
      window.location.href = "login.html";
    });
  }


  const recForm = document.getElementById("recoverForm");
  if(recForm){
    recForm.addEventListener("submit",(e)=>{
      e.preventDefault();
      alert("Correo enviado.");
      window.location.href = "login.html";
    });
  }

  document.querySelectorAll(".logout-btn").forEach(btn=>{
    btn.addEventListener("click",()=>{
      localStorage.removeItem("isLogged");
      localStorage.removeItem("currentUser");
      window.location.href = "index.html";
    });
  });

  if(document.getElementById("vehicleList")){
    fetch("data.json")
    .then(r=>r.json())
    .then(db=>{
      const out = document.getElementById("vehicleList");
      db.vehicles.forEach(v=>{
        out.innerHTML += `
        <div class="card mb-2">
          <div class="card-body">
            <h5>${v.model} - ${v.plate}</h5>
            <p><strong>Estado:</strong> ${v.status}</p>
            <p>${v.notes}</p>
          </div>
        </div>`;
      });
    });
  }


  document.querySelectorAll(".gallery-img").forEach(img=>{
    img.addEventListener("click",()=>{
      document.getElementById("lightboxImage").src = img.dataset.src;
      new bootstrap.Modal(document.getElementById("lightboxModal")).show();
    });
  });

  const searchForm = document.getElementById("searchForm");
  if(searchForm){
    searchForm.addEventListener("submit",(e)=>{
      e.preventDefault();
      const q = searchForm.query.value.toLowerCase();

      fetch("data.json").then(r=>r.json()).then(db=>{
        const results = db.services.filter(
          s => (s.type+s.vehicle).toLowerCase().includes(q)
        );

        const out = document.getElementById("searchResults");
        out.innerHTML = "";

        if(!results.length){
          out.innerHTML = "<p>No hay resultados</p>";
          return;
        }

        results.forEach(r=>{
          out.innerHTML += `
          <div class="card mb-2">
            <div class="card-body">
              <h5>${r.type} (${r.vehicle})</h5>
              <p>Precio: ₡${r.price}</p>
              <p>Estado: ${r.status}</p>
            </div>
          </div>`;
        });
      });
    });
  }

  
  const vehicleType = document.getElementById("vehicleType");
  const vehicleService = document.getElementById("vehicleService");

  if(vehicleType){
    vehicleType.addEventListener("change",()=>{
      const type = vehicleType.value;

      fetch("data.json").then(r=>r.json()).then(db=>{
        const arr = db.services.filter(s => s.vehicle.toLowerCase() === type.toLowerCase());
        vehicleService.innerHTML = "";
        arr.forEach(s=>{
          vehicleService.innerHTML += `<option value="${s.id}">${s.type}</option>`;
        });
      });
    });

    vehicleType.dispatchEvent(new Event("change"));
  }

  const contactForm = document.getElementById("contactForm");
  if(contactForm){
    contactForm.addEventListener("submit",(e)=>{
      e.preventDefault();

      emailjs.send(
        "service_z908woa",
        "template_l59dvl2",
        {
          name: contactForm.name.value,
          email: contactForm.email.value,
          message: contactForm.message.value
        }
      )
      .then(()=> alert("Mensaje enviado correctamente"))
      .catch(()=> alert("Error al enviar mensaje"));

      contactForm.reset();
    });
  }

  const citasForm = document.getElementById("citasForm");
  if(citasForm){
    citasForm.addEventListener("submit",(e)=>{
      e.preventDefault();

      emailjs.send(
        "service_z908woa",
        "template_l59dvl2",
        {
          name: citasForm.name.value,
          email: citasForm.email.value,
          date: citasForm.date.value,
          vehicle: citasForm.vehicle.value
        }
      )
      .then(()=> alert("Cita enviada. El taller la confirmará."))
      .catch(()=> alert("Error al enviar cita"));

      citasForm.reset();
    });
  }

});






const currency = (n)=>'₡' + Number(n || 0).toLocaleString('es-CR');
const PRICE_UNIT = '₡';
const LOCAL_KEY = 'PROYECTO_last_quote';

const partsData = {
  carro: [
    {id:'puerta_dd', name:'Puerta derecha delantera', price:120000},
    {id:'puerta_di', name:'Puerta izquierda delantera', price:120000},
    {id:'puerta_td', name:'Puerta derecha trasera', price:115000},
    {id:'puerta_ti', name:'Puerta izquierda trasera', price:115000},
    {id:'parachoques_del', name:'Parachoques delantero', price:150000},
    {id:'parachoques_tras', name:'Parachoques trasero', price:150000},
    {id:'techo', name:'Techo', price:180000},
    {id:'capo', name:'Capó', price:160000},
    {id:'porton', name:'Portón trasero', price:140000},
    {id:'parrilla', name:'Parrilla', price:90000},
    {id:'aletas', name:'Aletas', price:60000},
    {id:'caliper', name:'Caliper', price:25000},
    {id:'pilares', name:'Pilares de chasis', price:80000},
    {id:'estribos', name:'Estribos', price:70000},
    {id:'espejo', name:'Carcasa espejo retrovisor', price:25000},
    {id:'manija', name:'Manija de puertas', price:12000},
    {id:'molduras', name:'Molduras y vierteaguas', price:35000},
    {id:'aleron', name:'Alerones / spoilers', price:95000},
    {id:'emblemas', name:'Emblemas', price:8000},
    {id:'guardabarros', name:'Guardabarros', price:75000},
  ],
  moto: [
    {id:'deposito', name:'Depósito de gasolina', price:90000},
    {id:'carenados', name:'Carenados completos', price:150000},
    {id:'guardabarros', name:'Guardabarros', price:45000},
    {id:'tapas_l', name:'Tapas laterales', price:30000},
    {id:'paneles', name:'Paneles', price:35000},
    {id:'colin', name:'Colín', price:25000},
    {id:'espejo', name:'Carcasa retrovisor', price:12000},
    {id:'quilla', name:'Quilla', price:40000},
    {id:'chasis', name:'Chasis', price:200000},
    {id:'basculante', name:'Basculante', price:120000},
    {id:'llantas', name:'Llantas (rines)', price:50000},
    {id:'horquillas', name:'Horquillas', price:45000},
    {id:'manillar', name:'Manillar', price:20000},
    {id:'pinzas', name:'Pinzas de freno', price:22000},
    {id:'tapas_motor', name:'Tapas del motor', price:30000},
    {id:'estriberas', name:'Estriberas', price:15000},
    {id:'soportes', name:'Soportes y subchasis', price:30000},
  ]
};


const towPrices = {
  ligero: 50000,
  medio: 100000,
  pesado: 250000,
  moto_unit: 20000
};


const DISCOUNT_THRESHOLD = 1000000;
const DISCOUNT_THRESHOLD_PERCENT = 0.10;
const PINTURA_TOTAL_PERCENT = 0.20;
const MOTO_TOW_DISCOUNT = 0.30;


document.addEventListener("DOMContentLoaded",()=>{

  const elements = {
    tallerSelect: document.getElementById('tallerSelect'),
    serviceSelect: document.getElementById('serviceSelect'),
    vehicleType: document.getElementById('vehicleType'),
    partsList: document.getElementById('partsList'),
    paintOption: document.getElementById('paintOption'),
    pinturaInfo: document.getElementById('pinturaInfo'),
    pinturaTotalAmount: document.getElementById('pinturaTotalAmount'),
    towForVehicle: document.getElementById('towForVehicle'),
    towVehicleType: document.getElementById('towVehicleType'),
    towCarBlock: document.getElementById('towCarBlock'),
    towMotoBlock: document.getElementById('towMotoBlock'),
    towMotoCount: document.getElementById('towMotoCount'),
    pickupAddress: document.getElementById('pickupAddress'),
    dropoffAddress: document.getElementById('dropoffAddress'),
    mecanicaList: document.getElementById('mecanicaList'),
    pinturaOptions: document.getElementById('pinturaOptions'),
    gruaOptions: document.getElementById('gruaOptions'),
    mecanicaOptions: document.getElementById('mecanicaOptions'),
    summaryBody: document.getElementById('summaryBody'),
    subtotalEl: document.getElementById('subtotal'),
    discountEl: document.getElementById('discount'),
    finalTotalEl: document.getElementById('finalTotal'),
    clientName: document.getElementById('clientName'),
    clientEmail: document.getElementById('clientEmail'),
    downloadQuote: document.getElementById('downloadQuote'),
    sendEmail: document.getElementById('sendEmail'),
    saveLocal: document.getElementById('saveLocal'),
    loadLocal: document.getElementById('loadLocal'),
    notice: document.getElementById('notice'),
    downloadManual: document.getElementById('downloadManual'),
  };

  let currentSelection = {
    taller: elements.tallerSelect?.value,
    service: elements.serviceSelect?.value,
    vehicle: elements.vehicleType?.value,
    pieces: {},
    towMotoCount: 0,
    towVehicleType: elements.towVehicleType?.value || "ligero"
  };

  function renderParts(){
    if(!elements.partsList) return;
    elements.partsList.innerHTML = '';
    const v = elements.vehicleType.value;
    const list = partsData[v];

    list.forEach(p=>{
      const div = document.createElement('div');
      div.className='part-item';
      div.innerHTML = `
        <div>
          <div style="font-weight:600">${p.name}</div>
          <div class="small">${currency(p.price)}</div>
        </div>
        <div>
          <input type="number" min="0" value="${currentSelection.pieces[p.id] || 0}" 
                data-id="${p.id}" class="pieceQty" 
                style="width:80px; padding:6px;">
        </div>
      `;
      elements.partsList.appendChild(div);
    });

    document.querySelectorAll('.pieceQty').forEach(inp=>{
      inp.addEventListener('input', (e)=>{
        const id = e.target.dataset.id;
        const val = parseInt(e.target.value) || 0;
        if (val <= 0) delete currentSelection.pieces[id];
        else currentSelection.pieces[id] = val;
        recalc();
      });
    });
  }


  function renderMecanica(){
    if(!elements.mecanicaList) return;

    elements.mecanicaList.innerHTML = '';
    const v = elements.vehicleType.value;
    let items = [];

    if(v === "carro"){
      items = [
        {id:'mech_llantas', label:'Cambio / Reparación de llantas', price:50000},
        {id:'mech_transm', label:'Reparaciones de transmisiones', price:180000},
        {id:'mech_elec', label:'Reparación del sistema eléctrico', price:90000},
        {id:'mech_aceite', label:'Cambio de aceite', price:25000},
        {id:'mech_pastillas', label:'Cambio de pastillas', price:45000}
      ];
    }else{
      items = [
        {id:'mech_rep_motor', label:'Reparación de motor', price:150000},
        {id:'mech_elec_moto', label:'Reparación sistema eléctrico', price:70000},
        {id:'mech_susp', label:'Ajustes de suspensión', price:40000},
        {id:'mech_escape', label:'Reparación del sistema de escape', price:60000},
        {id:'mech_aceite_m', label:'Cambio de aceite', price:20000}
      ];
    }

    items.forEach(it=>{
      const lbl = document.createElement('label');
      lbl.innerHTML = `<input type="checkbox" data-price="${it.price}" id="${it.id}"> 
                      ${it.label} — ${currency(it.price)}`;
      elements.mecanicaList.appendChild(lbl);

      document.getElementById(it.id).addEventListener('change', recalc);
    });
  }


  function calcPinturaTotalAmount(){
    const v = elements.vehicleType.value;
    return partsData[v].reduce((sum,p)=> sum+p.price, 0);
  }

  function recalc(){
    if(!elements.summaryBody) return;

    elements.notice.textContent = '';

    const v = elements.vehicleType.value;
    let subtotal = 0;
    const lines = [];

    partsData[v].forEach(p=>{
      const qty = currentSelection.pieces[p.id] || 0;
      if(qty > 0){
        const amount = p.price * qty;
        subtotal += amount;
        lines.push({concept:p.name, qty, price:p.price, total:amount});
      }
    });

    const mechChecks = elements.mecanicaList.querySelectorAll("input[type=checkbox]");
    mechChecks.forEach(cb=>{
      if(cb.checked){
        const price = Number(cb.dataset.price);
        subtotal += price;
        lines.push({concept:cb.parentElement.textContent.trim(), qty:1, price, total:price});
      }
    });

    let towCost = 0;
    let towIncludedByPinturaTotal = false;

    const isPinturaTotal = (elements.paintOption?.value === "pintura_total" 
                            && elements.serviceSelect?.value === "pintura");

    if(isPinturaTotal){
      const pinturaAmount = calcPinturaTotalAmount();
      elements.pinturaInfo.style.display = "block";
      elements.pinturaTotalAmount.textContent = `Monto pintura total: ${currency(pinturaAmount)}`;

      lines.unshift({concept:"Pintura Total (beneficios incluidos)", qty:1, price:pinturaAmount, total:pinturaAmount});
      lines.push({concept:"(Beneficio) Cambio de aceite incluido", qty:1, price:0, total:0});
      lines.push({concept:"(Beneficio) Grúa incluida", qty:1, price:0, total:0});
      towIncludedByPinturaTotal = true;
    } else {
      if(elements.pinturaInfo) elements.pinturaInfo.style.display = "none";
    }

    if(elements.serviceSelect?.value === "grua" ||
      (isPinturaTotal && (elements.pickupAddress.value || elements.dropoffAddress.value))){

      const towFor = elements.towForVehicle.value;

      if(towFor === "moto"){
        const count = parseInt(elements.towMotoCount.value)||0;
        if(count>0){
          let t = towPrices.moto_unit * count;
          if(count>=2) t = Math.round(t*(1-MOTO_TOW_DISCOUNT));

          if(!towIncludedByPinturaTotal){
            towCost += t;
            lines.push({concept:`Traslado motos (${count})`, qty:count, price:towPrices.moto_unit, total:t});
          }else{
            lines.push({concept:`Traslado motos (${count}) (incluido)`, qty:count, price:0, total:0});
          }
        }
      } else {
        const ttype = elements.towVehicleType.value;
        const base = towPrices[ttype];
        if(!towIncludedByPinturaTotal){
          towCost += base;
          lines.push({concept:`Traslado vehículo (${ttype})`, qty:1, price:base, total:base});
        }else{
          lines.push({concept:`Traslado vehículo (${ttype}) (incluido)`, qty:1, price:0, total:0});
        }
      }

      subtotal += towCost;
    }


    let discount = 0;

    let piecesOnlyTotal = 0;
    partsData[v].forEach(p=>{
      const qty = currentSelection.pieces[p.id] || 0;
      if(qty>0) piecesOnlyTotal += p.price * qty;
    });

    if(piecesOnlyTotal > DISCOUNT_THRESHOLD){
      const applied = Math.round(piecesOnlyTotal * DISCOUNT_THRESHOLD_PERCENT);
      discount += applied;

      elements.notice.innerHTML = 
        `<span class="towed">Se aplica ${DISCOUNT_THRESHOLD_PERCENT*100}% de descuento por monto y transporte de grúa gratis.</span>`;

      if(!towIncludedByPinturaTotal && elements.serviceSelect.value === "grua"){
        subtotal = Math.max(0, subtotal - towCost);
      }
    }

    if(isPinturaTotal){
      const pinturaAmount = calcPinturaTotalAmount();
      discount += Math.round(pinturaAmount * PINTURA_TOTAL_PERCENT);
    }


    const total = Math.max(0, subtotal - discount);

    elements.summaryBody.innerHTML = "";
    lines.forEach(l=>{
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${l.concept}</td><td>${l.qty}</td><td>${currency(l.total)}</td>`;
      elements.summaryBody.appendChild(tr);
    });

    elements.subtotalEl.textContent = currency(subtotal);
    elements.discountEl.textContent = "-"+currency(discount);
    elements.finalTotalEl.textContent = currency(total);

    window.lastQuote = {
      taller: elements.tallerSelect?.value,
      service: elements.serviceSelect?.value,
      vehicle: elements.vehicleType?.value,
      clientName: elements.clientName?.value || '',
      clientEmail: elements.clientEmail?.value || '',
      lines, subtotal, discount, total,
      pickup: elements.pickupAddress?.value || '',
      dropoff: elements.dropoffAddress?.value || ''
    };
  }


  if(elements.vehicleType){
    elements.vehicleType.addEventListener("change", ()=>{
      currentSelection.pieces = {};
      renderParts();
      renderMecanica();
      recalc();
    });
  }

  if(elements.paintOption)
    elements.paintOption.addEventListener("change", recalc);

  if(elements.serviceSelect)
    elements.serviceSelect.addEventListener("change", ()=>{
      const val = elements.serviceSelect.value;
      elements.pinturaOptions.style.display = (val==="pintura") ? "block" : "none";
      elements.gruaOptions.style.display = (val==="grua") ? "block" : "none";
      elements.mecanicaOptions.style.display = (val==="mecanica") ? "block" : "none";
      recalc();
    });

  if(elements.towForVehicle){
    elements.towForVehicle.addEventListener("change", ()=>{
      const v = elements.towForVehicle.value;
      elements.towCarBlock.style.display = (v==="carro") ? "block" : "none";
      elements.towMotoBlock.style.display = (v==="moto") ? "block" : "none";
      recalc();
    });
  }

  if(elements.towMotoCount)
    elements.towMotoCount.addEventListener("input", recalc);

  if(elements.towVehicleType)
    elements.towVehicleType.addEventListener("change", recalc);


  if(elements.saveLocal){
  elements.saveLocal.addEventListener("click", async ()=>{
    if(!window.lastQuote){
      await Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'No hay cotización para guardar.'
      });
      return;
    }

    localStorage.setItem(LOCAL_KEY, JSON.stringify(window.lastQuote));

    await Swal.fire({
      icon: 'success',
      title: '¡Listo!',
      text: 'Cotización guardada correctamente.'
    });
  });
}


  if(elements.loadLocal){
  elements.loadLocal.addEventListener("click", ()=>{
    const data = localStorage.getItem(LOCAL_KEY);
    if(!data){
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'No hay cotización guardada.',
        confirmButtonColor: '#3085d6',
      });
      return;
    }

    const q = JSON.parse(data);

    elements.tallerSelect.value = q.taller;
    elements.serviceSelect.value = q.service;
    elements.vehicleType.value = q.vehicle;
    elements.clientName.value = q.clientName;
    elements.clientEmail.value = q.clientEmail;
    elements.pickupAddress.value = q.pickup;
    elements.dropoffAddress.value = q.dropoff;

    currentSelection.pieces = {};

    renderParts();
    renderMecanica();
    recalc();

    Swal.fire({
      icon: 'success',
      title: '¡Éxito!',
      text: 'Cotización cargada correctamente.',
      confirmButtonColor: '#3085d6',
    });
  });
}



if(elements.downloadQuote){
  elements.downloadQuote.addEventListener("click", async ()=>{
    if(!window.lastQuote){
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'No hay cotización para descargar.',
        confirmButtonColor: '#3085d6',
      });
      return;
    }

    const q = window.lastQuote;

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({unit:"pt", format:"a4"});

    doc.setFontSize(18);
    doc.text(q.taller, 40, 50);

    doc.setFontSize(12);
    doc.text(`Cliente: ${q.clientName}`, 40, 80);
    doc.text(`Email: ${q.clientEmail}`, 40, 98);

    let y = 140;
    doc.text(" Items y subtotales:", 40, y); 
    y+=20;

    q.lines.forEach(l=>{
      doc.text(`${l.concept} - Cant: ${l.qty} - Total: ${currency(l.total)}`, 48, y);
      y+=14;
      if(y>700){ 
        doc.addPage(); 
        y=40; 
      }
    });

    y+=20;
    doc.text(`Subtotal: ${currency(q.subtotal)}`, 40, y); y+=14;
    doc.text(`Descuento: -${currency(q.discount)}`, 40, y); y+=14;
    doc.text(`TOTAL: ${currency(q.total)}`, 40, y);

    doc.save(`cotizacion_${(q.clientName||"cliente")}.pdf`);

    Swal.fire({
      icon: 'success',
      title: '¡Listo!',
      text: 'Cotización descargada correctamente.',
      confirmButtonColor: '#3085d6',
    });
  });
}



if(elements.sendEmail){
  elements.sendEmail.addEventListener("click", async ()=>{
    if(!window.lastQuote){
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'No hay cotización para enviar.',
        confirmButtonColor: '#3085d6',
      });
      return;
    }

    const q = window.lastQuote;

    const piecesText = q.lines.map(
      l => `${l.concept} (x${l.qty}) - ${currency(l.total)}`
    ).join("\n");

    emailjs.send(
      "service_qxllsjj",
      "template_xot4mtl",
      {
        workshop: q.taller,
        client_name: q.clientName,
        client_email: q.clientEmail,
        service: q.service,
        vehicle: q.vehicle,
        pieces_list: piecesText,
        subtotal: currency(q.subtotal),
        discount: "-" + currency(q.discount),
        total: currency(q.total),
      }
    )
    .then(()=>{
      Swal.fire({
        icon: 'success',
        title: '¡Éxito!',
        text: 'Correo enviado correctamente.',
        confirmButtonColor: '#3085d6',
      });
    })
    .catch(()=>{
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo enviar el correo.',
        confirmButtonColor: '#d33',
      });
    });
  });
}


if(elements.downloadManual){
  elements.downloadManual.addEventListener("click", ()=>{
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({unit:"pt", format:"a4"});

    let y = 40;

    doc.setFontSize(20);
    doc.text("Manual de Uso - Cotizador Taller Navarro", 40, y); 
    y += 28;


    doc.setFontSize(12);
    doc.text("Bienvenido al manual de usuario de la aplicación de cotización del Taller Navarro.", 40, y, {maxWidth:500}); 
    y += 18;
    doc.text("Esta guía explica paso a paso cómo usar la aplicación para realizar cotizaciones de pintura, grúas y servicios mecánicos.", 40, y, {maxWidth:500});
    y += 28;

    doc.setFontSize(14);
    doc.text("1. Selección de Taller y Servicio", 40, y);
    y += 18;
    doc.setFontSize(12);
    doc.text("• Selecciona el taller donde se realizará el servicio.", 48, y, {maxWidth:500}); y += 14;
    doc.text("• Elige el tipo de servicio: Pintura, Grúa o Mecánica.", 48, y, {maxWidth:500}); y += 14;


    doc.setFontSize(14);
    y += 10;
    doc.text("2. Selección del Vehículo", 40, y); y += 18;
    doc.setFontSize(12);
    doc.text("• Indica si el vehículo es un carro o una moto.", 48, y, {maxWidth:500}); y += 14;
    doc.text("• Dependiendo del tipo, se mostrarán las piezas disponibles para cotizar.", 48, y, {maxWidth:500}); y += 14;


    doc.setFontSize(14);
    y += 10;
    doc.text("3. Selección de Piezas y Servicios Mecánicos", 40, y); y += 18;
    doc.setFontSize(12);
    doc.text("• Para cada pieza, ingresa la cantidad requerida.", 48, y, {maxWidth:500}); y += 14;
    doc.text("• Marca los servicios mecánicos que deseas incluir en la cotización.", 48, y, {maxWidth:500}); y += 14;


    doc.setFontSize(14);
    y += 10;
    doc.text("4. Opciones de Pintura y Grúa", 40, y); y += 18;
    doc.setFontSize(12);
    doc.text("• Si eliges Pintura, selecciona si es pintura parcial o pintura total.", 48, y, {maxWidth:500}); y += 14;
    doc.text("• Si eliges Grúa, indica si es para carro o moto y la cantidad de motos a trasladar.", 48, y, {maxWidth:500}); y += 14;
    doc.text("• Los beneficios de pintura total incluyen aceite y traslado gratis.", 48, y, {maxWidth:500}); y += 14;


    doc.setFontSize(14);
    y += 10;
    doc.text("5. Datos del Cliente", 40, y); y += 18;
    doc.setFontSize(12);
    doc.text("• Ingresa el nombre y correo electrónico del cliente.", 48, y, {maxWidth:500}); y += 14;


    doc.setFontSize(14);
    y += 10;
    doc.text("6. Revisión y Envío de Cotización", 40, y); y += 18;
    doc.setFontSize(12);
    doc.text("• Verifica el resumen de la cotización con subtotal, descuentos y total.", 48, y, {maxWidth:500}); y += 14;
    doc.text("• Puedes guardar la cotización en el almacenamiento local para usarla después.", 48, y, {maxWidth:500}); y += 14;
    doc.text("• Descarga la cotización en PDF o envíala por correo electrónico al cliente.", 48, y, {maxWidth:500}); y += 14;


    doc.setFontSize(14);
    y += 10;
    doc.text("7. Consejos y recomendaciones", 40, y); y += 18;
    doc.setFontSize(12);
    doc.text("• Asegúrate de ingresar correctamente las cantidades y tipos de piezas.", 48, y, {maxWidth:500}); y += 14;
    doc.text("• Revisa siempre los datos del cliente antes de enviar la cotización.", 48, y, {maxWidth:500}); y += 14;


    doc.save("manual_usuario_cotizacion.pdf");
  });
}



  if(elements.partsList){
    renderParts();
    renderMecanica();
    recalc();
  }

});
