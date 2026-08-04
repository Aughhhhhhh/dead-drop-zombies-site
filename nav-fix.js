document.addEventListener('click', (event) => {
  const link = event.target.closest('.guide-sidebar a');
  if (!link) return;
  const href = link.getAttribute('href') || '';
  if (!href.startsWith('#') || href.startsWith('#/')) return;
  const target = document.getElementById(href.slice(1));
  if (!target) return;
  event.preventDefault();
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  const route = location.hash.split('#').slice(0, 2).join('#');
  history.replaceState(null, '', `${route}${href}`);
});
