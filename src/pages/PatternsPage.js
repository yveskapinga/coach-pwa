import { analytics } from '../api.js';
import { navigate } from '../router.js';
import BottomNav from '../components/BottomNav.js';

export default async function PatternsPage(container) {
  const page = document.createElement('div');
  page.className = 'page';
  page.innerHTML = `<div id="content">Chargement...</div>`;
  container.appendChild(page);

  let p;
  try { p = await analytics.patterns(); } catch { return navigate('/dashboard'); }
  const data = p.patterns;

  let html = `<h1>📊 Tendances</h1><div class="card">`;
  html += `
    <div style="display:flex; justify-content:space-between; margin-bottom:16px;">
      <div style="text-align:center; flex:1;">
        <div style="font-size:28px; font-weight:700; color:var(--primary);">${data.avg_completion}%</div>
        <div style="font-size:12px; color:var(--text-muted);">Moyenne</div>
      </div>
      <div style="text-align:center; flex:1;">
        <div style="font-size:28px; font-weight:700; color:var(--success);">${data.days_count}</div>
        <div style="font-size:12px; color:var(--text-muted);">Jours</div>
      </div>
    </div>
  `;

  if (data.top_concepts && data.top_concepts.length) {
    html += `<h2>Top concepts</h2>`;
    data.top_concepts.forEach(c => {
      html += `<div class="action-item"><span>${c.label}</span><span style="color:var(--text-muted);">${c.count}x</span></div>`;
    });
  }

  if (data.common_failure_reasons && data.common_failure_reasons.length) {
    html += `<h2 style="margin-top:16px;">Freins récurrents</h2>`;
    data.common_failure_reasons.forEach(c => {
      html += `<div class="action-item" style="border-left:3px solid var(--danger);"><span>${c.label}</span><span style="color:var(--text-muted);">${c.count}x</span></div>`;
    });
  }

  html += `</div>`;
  page.querySelector('#content').innerHTML = html;

  container.appendChild(BottomNav());
}
