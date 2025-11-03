document.getElementById('btnCalcular').addEventListener('click', () => {
  const consumo = parseFloat(document.getElementById('consumo').value);
  const horas = parseFloat(document.getElementById('provincia').value);
  const resultados = document.getElementById('resultados');

  if (!consumo || !horas) {
    alert('Por favor, completa todos los campos.');
    return;
  }

  const diario = consumo / 30;
  const sistema = diario / (horas * 0.75);
  const paneles = Math.ceil((sistema * 1000) / 400);
  const area = paneles * 2;

  document.getElementById('potencia').textContent = sistema.toFixed(2) + ' kW';
  document.getElementById('paneles').textContent = paneles;
  document.getElementById('area').textContent = area + ' m²';

  resultados.classList.remove('hidden');
  resultados.scrollIntoView({ behavior: 'smooth' });
});
