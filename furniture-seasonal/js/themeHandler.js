document.addEventListener('DOMContentLoaded', () => {
  const selector = document.getElementById('seasonSelector');
  const toggleBtn = document.getElementById('modeToggle');
  const body = document.body;

  let season = localStorage.getItem('selectedSeason') || 'spring';
  let mode = localStorage.getItem('selectedMode') || 'light';

  function applyTheme() {
    body.className = `${season}-theme ${mode}`;
    selector.value = season;
    toggleBtn.textContent = mode === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode';
  }

  applyTheme();

  selector.addEventListener('change', (e) => {
    season = e.target.value;
    localStorage.setItem('selectedSeason', season);
    applyTheme();
  });

  toggleBtn.addEventListener('click', () => {
    mode = mode === 'light' ? 'dark' : 'light';
    localStorage.setItem('selectedMode', mode);
    applyTheme();
  });
});
