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

// Variables globales para el mapa y la ubicación
let map;
let marker = null;
let horasPicoGlobal = null;
let latGlobal = null;
let lngGlobal = null;

// Estimar horas pico de sol según la latitud (modelo simplificado)
function estimarHorasPico(lat) {
  const absLat = Math.abs(lat);
  if (absLat <= 15) return 6.0;    // zona ecuatorial
  if (absLat <= 25) return 5.5;
  if (absLat <= 35) return 5.0;
  if (absLat <= 45) return 4.5;
  if (absLat <= 55) return 3.5;
  return 2.5;                      // latitudes altas
}

// Colocar/actualizar marcador y actualizar textos de lat/lng/horas pico
function setMarkerAndData(latLng) {
  latGlobal = latLng.lat();
  lngGlobal = latLng.lng();

  if (!marker) {
    marker = new google.maps.Marker({
      position: latLng,
      map: map
    });
  } else {
    marker.setPosition(latLng);
  }

  const horas = estimarHorasPico(latGlobal);
  horasPicoGlobal = horas;

  const latSpan = document.getElementById("latitud");
  const lngSpan = document.getElementById("longitud");
  const horasSpan = document.getElementById("horasPico");

  if (latSpan) latSpan.textContent = latGlobal.toFixed(4);
  if (lngSpan) lngSpan.textContent = lngGlobal.toFixed(4);
  if (horasSpan) horasSpan.textContent = horas.toFixed(1);
}

// Callback global para Google Maps (lo llama el script de Maps)
function initMap() {
  const mapElement = document.getElementById("map");
  if (!mapElement) return;

  map = new google.maps.Map(mapElement, {
    center: { lat: 0, lng: 0 },
    zoom: 2
  });

  // Click en el mapa → seleccionar ubicación
  map.addListener("click", function (e) {
    setMarkerAndData(e.latLng);
  });
}

// Usar la geolocalización del navegador
function usarMiUbicacion() {
  if (!navigator.geolocation) {
    alert("Tu navegador no soporta geolocalización.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    function (pos) {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      const latLng = new google.maps.LatLng(lat, lng);

      if (map) {
        map.setCenter(latLng);
        map.setZoom(8);
      }
      setMarkerAndData(latLng);
    },
    function (err) {
      console.error(err);
      alert("No se pudo obtener tu ubicación. Revisa los permisos del navegador.");
    }
  );
}

// Cálculo principal de la calculadora
function calcularSistemaSolar() {
  var consumoInput = document.getElementById("consumo");
  var potenciaPanelInput = document.getElementById("potenciaPanel");
  var factorPerdidasInput = document.getElementById("factorPerdidas");

  if (!consumoInput || !potenciaPanelInput || !factorPerdidasInput) {
    alert("Faltan campos de la calculadora en el HTML.");
    return;
  }

  var consumoMensual = parseFloat(consumoInput.value);
  var potenciaPanel = parseFloat(potenciaPanelInput.value); // W
  var perdidasPorc = parseFloat(factorPerdidasInput.value);

  if (!latGlobal || !lngGlobal || !horasPicoGlobal) {
    alert("Primero selecciona una ubicación en el mapa o usa tu ubicación.");
    return;
  }

  if (!consumoMensual || consumoMensual <= 0) {
    alert("Por favor ingresa un consumo mensual válido.");
    return;
  }

  if (!potenciaPanel || potenciaPanel <= 0) {
    alert("Por favor ingresa una potencia de panel válida.");
    return;
  }

  if (isNaN(perdidasPorc) || perdidasPorc < 0 || perdidasPorc > 90) {
    perdidasPorc = 25; // valor por defecto si se mete algo raro
  }

  var factorEficiencia = 1 - perdidasPorc / 100; // 25% → 0.75
  var consumoDiario = consumoMensual / 30;        // kWh/día

  // Potencia requerida del sistema en kW
  var potenciaSistema = consumoDiario / (horasPicoGlobal * factorEficiencia);

  // Número de paneles
  var paneles = Math.ceil((potenciaSistema * 1000) / potenciaPanel);

  // Área estimada (2 m² por panel)
  var area = paneles * 2;

  var potenciaSistemaEl = document.getElementById("potenciaSistema");
  var cantidadPanelesEl = document.getElementById("cantidadPaneles");
  var areaRequeridaEl = document.getElementById("areaRequerida");
  var resultados = document.getElementById("resultados");

  if (potenciaSistemaEl) {
    potenciaSistemaEl.textContent = potenciaSistema.toFixed(2) + " kW";
  }
  if (cantidadPanelesEl) {
    cantidadPanelesEl.textContent = paneles;
  }
  if (areaRequeridaEl) {
    areaRequeridaEl.textContent = area.toFixed(1) + " m²";
  }
  if (resultados) {
    resultados.classList.remove("hidden");
    try {
      resultados.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (e) {
      // Safari viejo puede no soportar el objeto de opciones
    }
  }
}

// Enlazar eventos cuando el DOM está listo
document.addEventListener("DOMContentLoaded", function () {
  var btnUbicacion = document.getElementById("btnUbicacion");
  var btnCalcular = document.getElementById("btnCalcular");

  if (btnUbicacion) {
    btnUbicacion.addEventListener("click", function () {
      usarMiUbicacion();
    });
  }

  if (btnCalcular) {
    btnCalcular.addEventListener("click", function () {
      calcularSistemaSolar();
    });
  }
});

// Exportar initMap al ámbito global (para Google Maps)
window.initMap = initMap;
