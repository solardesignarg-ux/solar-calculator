// assets/app.js
'use strict';
document.addEventListener('DOMContentLoaded', function () {
  // Toggle menú móvil
  var nav = document.querySelector('.sd-nav');
  var toggle = document.getElementById('sd-menu-toggle');

  if (nav && toggle) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
    });
  }
});


document.addEventListener('DOMContentLoaded', function () {
  // Referencias a los elementos del DOM
  var btnCalcular     = document.getElementById('btnCalcular');
  var inputConsumo    = document.getElementById('consumo');
  var selectProvincia = document.getElementById('provincia');
  var resultadosBox   = document.getElementById('resultados');
  var potenciaEl      = document.getElementById('potencia');
  var panelesEl       = document.getElementById('paneles');
  var areaEl          = document.getElementById('area');

  // Si por algún motivo no existen (carga parcial de la página, error de copia, etc.), salimos sin romper nada
  if (
    !btnCalcular ||
    !inputConsumo ||
    !selectProvincia ||
    !resultadosBox ||
    !potenciaEl ||
    !panelesEl ||
    !areaEl
  ) {
    return;
  }

  btnCalcular.addEventListener('click', function () {
    // Convertimos comas a puntos por si el usuario pone "300,5"
    var consumo = parseFloat(String(inputConsumo.value).replace(',', '.'));
    var horas   = parseFloat(String(selectProvincia.value).replace(',', '.'));

    // Validación robusta: NaN, vacíos o valores <= 0
    if (!isFinite(consumo) || consumo <= 0 || !isFinite(horas) || horas <= 0) {
      alert('Por favor, completa todos los campos con valores válidos.');
      return;
    }

    // Cálculos
    var diario   = consumo / 30;           // kWh/día
    var sistema  = diario / (horas * 0.75); // kW del sistema
    var paneles  = Math.ceil((sistema * 1000) / 400); // paneles de 400 W
    var area     = paneles * 2;            // m² aprox

    // Actualizamos UI
    potenciaEl.textContent = sistema.toFixed(2) + ' kW';
    panelesEl.textContent  = String(paneles);
    areaEl.textContent     = area + ' m²';

    // Mostramos la caja de resultados
    resultadosBox.classList.remove('hidden');

    // Scroll suave hacia los resultados
    // Safari antiguo puede no soportar el objeto options, así que lo protegemos
    try {
      resultadosBox.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    } catch (e) {
      // Fallback para navegadores que no soportan scrollIntoView con opciones
      resultadosBox.scrollIntoView();
    }
  });
});



