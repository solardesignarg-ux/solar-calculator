// Espera a que Tailwind y Lucide estén disponibles y luego inicializa todo
window.addEventListener('DOMContentLoaded', () => {
  // activar iconos (si lucide cargó correctamente)
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }

  // menú mobile
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('active');
    });
  }

  // calculadora
  const calculateBtn = document.getElementById('calculate-btn');
  const consumptionInput = document.getElementById('consumption');
  const locationSelect = document.getElementById('location');
  const results = document.getElementById('results');

  const systemSizeEl = document.getElementById('system-size');
  const panelsEl = document.getElementById('panels');
  const areaEl = document.getElementById('area');

  function isPosNumber(v){ return Number.isFinite(v) && v > 0; }

  if (calculateBtn && consumptionInput && locationSelect && results) {
    calculateBtn.addEventListener('click', () => {
      const consumption = parseFloat(consumptionInput.value);
      const peakSunHours = parseFloat(locationSelect.value);

      if (!isPosNumber(consumption) || !isPosNumber(peakSunHours)) {
        alert('Por favor completa todos los campos con valores válidos.');
        return;
      }

      const dailyConsumption = consumption / 30;               // kWh/día
      const systemSize = dailyConsumption / (peakSunHours * 0.75); // kW
      const panels = Math.ceil((systemSize * 1000) / 400);     // 400 Wp/panel
      const area = panels * 2;                                 // ~2 m² por panel

      if (systemSizeEl) systemSizeEl.textContent = systemSize.toFixed(2) + ' kW';
      if (panelsEl) panelsEl.textContent = panels;
      if (areaEl) areaEl.textContent = area + ' m²';

      results.classList.remove('hidden');
      results.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }

  // scroll suave interno (por si navegan dentro del iframe)
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});
