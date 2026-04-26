import { days } from '../api.js';
import { navigate } from '../router.js';
import BottomNav from '../components/BottomNav.js';

export default async function DayPage(container) {
  const id = location.pathname.split('/').pop();
  const page = document.createElement('div');
  page.className = 'page';
  page.innerHTML = `<div id="content">Chargement...</div>`;
  container.appendChild(page);

  let data;
  try { data = await days.get(id); } catch (e) { alert('Journée non trouvée'); return navigate('/dashboard'); }

  const d = data.day;
  const entries = data.entries || [];
  const actions = entries.filter(e => e.type === 'ACTION');
  const focus = entries.find(e => e.type === 'FOCUS');
  const hasEvening = entries.some(e => ['ACCOMPLISHMENT','LESSON','RULE'].includes(e.type));
  const hasGratitude = entries.some(e => e.type === 'GRATITUDE');

  let html = `
    <div style="display:flex; align-items:center; gap:12px; margin-bottom:16px;">
      <button class="btn btn-outline" style="width:auto; padding:8px 14px;" id="btn-back">←</button>
      <h1 style="margin:0;">${new Date(d.date).toLocaleDateString('fr-FR')}</h1>
    </div>
    <span class="status-badge status-${d.status.toLowerCase()}">${d.status}</span>
  `;

  if (d.status === 'CREATED') {
    html += `
      <div class="card" style="margin-top:16px;">
        <h2>☀️ Matin</h2>
        <p style="color:var(--text-muted);">Définissez vos actions et votre focus.</p>
        <button class="btn btn-primary" id="btn-morning">Configurer le matin</button>
      </div>
    `;
  } else {
    html += `
      <div class="card" style="margin-top:16px;">
        <h2>☀️ Matin</h2>
        ${focus ? `<p style="color:var(--primary); font-weight:600;">🎯 Focus : ${focus.raw_text}</p>` : ''}
        ${actions.map(a => `
          <div class="action-item">
            <span>${a.raw_text}</span>
            <span class="action-check ${a.status === 'DONE' ? 'done' : a.status === 'NOT_DONE' ? 'not-done' : ''}">
              ${a.status === 'DONE' ? '✓' : a.status === 'NOT_DONE' ? '✕' : ''}
            </span>
          </div>
        `).join('')}
        ${d.status === 'STARTED' ? `<button class="btn btn-primary" style="margin-top:12px;" id="btn-exec">Faire le point</button>` : ''}
      </div>
    `;

    if (d.status === 'COMPLETED') {
      html += `
        <div class="card">
          <h2>🌙 Soir</h2>
          ${hasEvening ? '<p style="color:var(--success);">✅ Analyse complétée</p>' : '<button class="btn btn-primary" id="btn-evening">Faire l\'analyse du soir</button>'}
        </div>
        <div class="card">
          <h2>🙏 Gratitude</h2>
          ${hasGratitude ? '<p style="color:var(--success);">✅ 3 items enregistrés</p>' : '<button class="btn btn-primary" id="btn-gratitude">Ajouter gratitude</button>'}
        </div>
        <div class="card" style="text-align:center;">
          <h2>Score</h2>
          <div class="score-ring" id="score-ring">-</div>
          <button class="btn btn-outline" id="btn-score">Voir le détail</button>
        </div>
      `;
    }
  }

  page.querySelector('#content').innerHTML = html;

  page.querySelector('#btn-back').onclick = () => navigate('/dashboard');
  const btnMorning = page.querySelector('#btn-morning');
  if (btnMorning) btnMorning.onclick = () => navigate(`/day/${id}/morning`);
  const btnExec = page.querySelector('#btn-exec');
  if (btnExec) btnExec.onclick = () => navigate(`/day/${id}/execution`);
  const btnEvening = page.querySelector('#btn-evening');
  if (btnEvening) btnEvening.onclick = () => navigate(`/day/${id}/evening`);
  const btnGratitude = page.querySelector('#btn-gratitude');
  if (btnGratitude) btnGratitude.onclick = () => navigate(`/day/${id}/gratitude`);
  const btnScore = page.querySelector('#btn-score');
  if (btnScore) btnScore.onclick = () => navigate(`/day/${id}/score`);

  if (d.status === 'COMPLETED') {
    try {
      const s = await days.score(id);
      page.querySelector('#score-ring').textContent = s.score.score;
    } catch {}
  }

  container.appendChild(BottomNav());
}
