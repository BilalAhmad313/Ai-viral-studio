(() => {
  const input = document.getElementById('faq-search-input');
  const list = document.getElementById('faq-list');
  if (!input || !list) return;

  const items = Array.from(list.querySelectorAll('details'));

  function normalize(s) {
    return (s || '').toString().toLowerCase().trim();
  }

  function setVisibility(visibleDetails) {
    const visibleSet = new Set(visibleDetails);
    for (const d of items) {
      const isVisible = visibleSet.has(d);
      d.style.display = isVisible ? '' : 'none';
    }
  }

  function filter() {
    const q = normalize(input.value);
    if (!q) {
      setVisibility(items);
      return;
    }

    const matches = items.filter(d => {
      const summary = d.querySelector('summary')?.textContent || '';
      const answer = d.querySelector('p')?.textContent || '';
      const text = normalize(summary + ' ' + answer);
      return text.includes(q);
    });

    setVisibility(matches);
  }

  input.addEventListener('input', filter);
})();

