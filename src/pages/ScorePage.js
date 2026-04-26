import { days } from '../api.js';
import { navigate } from '../router.js';

export default async function ScorePage(container) {
  const id = location.pathname.split('/').pop();
  const page = document.createElement('div');
  page.className = 'page';
  page.innerHTML = `<div id="content">Chargement...</div>`;
  container.appendChild(page);

  let s;
  try { s = await days.score(id); } catch { return navigate('/dashboard'); }
  const sc = s.score;

  page.querySelector('#content').innerHTML = `
    <div style="display:flex; align-items:center; gap:12px; margin-bottom:16px;">
      <button class="btn btn-outline" style="width:auto; padding:8px 14px;" id="btn-back">←</button>
      <h1 style="margin:0;">Score</h1>
    </div>
    <div class="card" style="text-align:center;">
      <div class="score-ring">${sc.score}</div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-top:16px;">
        <div class="card" style="margin:0;">
          <div style="font-size:24px; font-weight:700; color:var(--primary);">${sc.completion_rate}%</div>
          <div style="font-size:12px; color:var(--text-muted);">Actions faites</div>
        </div>
        <div class="card" style="margin:0;">
          <div style="font-size:24px; font-weight:700; color:var(--success);">${sc.actions_done}/${sc.actions_total}</div>
          <div style="font-size:12px; color:var(--text-muted);">Ratio</div>
        </div>
        <div class="card" style="margin:0; ${sc.has_evening ? 'border:1px solid var(--success);' : ''}">
          <div style="font-size:24px;">${sc.has_evening ? '✅' : '❌'}</div>
          <div style="font-size:12px; color:var(--text-muted);">Soir</div>
        </div>
        <div class="card" style="margin:0; ${sc.has_gratitude ? 'border:1px solid var(--success);' : ''}">
          <div style="font-size:24px;">${sc.has_gratitude ? '✅' : '❌'}</div>
          <div style="font-size:12px; color:var(--text-muted);">Gratitude</div>
        </div>
      </div>
    </div>
  `;

  page.querySelector('#btn-back').onclick = () => navigate(`/day/${id}`);
}
