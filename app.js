(function(){
  const $ = (id)=>document.getElementById(id);
  const r = (v,d=2)=>{const f=10**d;return Math.round((+v)*f)/f;}
  const fmt = (n)=> new Intl.NumberFormat('es-AR').format(n);

  function calc(){
    const consumo   = +$('consumo').value || 0;
    const cob       = (+$('cobertura').value||0)/100;
    const irr       = +$('irr').value || 0;
    const pr        = +$('pr').value || 0;
    const wp        = +$('wp').value || 0;
    const tarifa    = +$('tarifa').value || 0;
    const costokwp  = +$('costokwp').value || 0;

    const energiaAnual = consumo*12*cob;
    const prodAnualKwp = irr*365*pr;
    const kwp          = prodAnualKwp>0 ? energiaAnual/prodAnualKwp : 0;

    const paneles    = wp>0 ? Math.ceil((kwp*1000)/wp) : 0;
    const genMensual = kwp*irr*30*pr;
    const ahorro     = Math.min(genMensual, consumo)*tarifa;
    const inversion  = kwp*costokwp;

    $('out-kwp').textContent       = r(kwp,2);
    $('out-paneles').textContent   = paneles;
    $('out-gen').textContent       = r(genMensual,0);
    $('out-ahorro').textContent    = fmt(r(ahorro,0));
    $('out-inversion').textContent = costokwp>0 ? fmt(r(inversion,0)) : '—';
  }

  document.addEventListener('input', calc);
  document.addEventListener('DOMContentLoaded', calc);
})();
