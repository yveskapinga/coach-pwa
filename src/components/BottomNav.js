import { navigate } from '../router.js';

const items = [
  { path: '/dashboard', label: 'Accueil', icon: '🏠' },
  { path: '/day', label: 'Journée', icon: '📅' },
  { path: '/patterns', label: 'Stats', icon: '📊' },
  { path: '/profile', label: 'Profil', icon: '👤' },
];

export default function BottomNav() {
  const nav = document.createElement('nav');
  nav.className = 'bottom-nav';
  const current = location.pathname;

  items.forEach(item => {
    const a = document.createElement('a');
    a.className = 'nav-item' + (current === item.path ? ' active' : '');
    a.href = item.path;
    a.innerHTML = `<span>${item.icon}</span><span>${item.label}</span>`;
    a.onclick = (e) => { e.preventDefault(); navigate(item.path); };
    nav.appendChild(a);
  });

  return nav;
}
