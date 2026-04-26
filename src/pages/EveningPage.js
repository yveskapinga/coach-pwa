import { days } from '../api.js';
import { navigate } from '../router.js';

export default function EveningPage(container) {
  const id = location.pathname.split('/').pop();
  const page = document.createElement('div');
  page.className = 'page';
  page.innerHTML = `
    <div style="display:flex; align-items:center; gap:12px; margin-bottom:16px;">
      <button class="btn btn-outline" style="width:auto; padding:8px 14px;" id="btn-back">←</button>
      <h1 style="margin:0;">🌙 Soir</h1>
    </div>
    <div class="card">
      <label>Accomplissements</label>
      <textarea id="accomplishments" placeholder="Qu'avez-vous accompli aujourd'hui ?"></textarea>
      <label>Évitements</label>
      <textarea id="avoidances" placeholder="Qu'avez-vous évité ?"></textarea>
      <label>Raison d'échec (si applicable)</label>
      <textarea id="failure_reason" placeholder="Pourquoi certaines actions n'ont pas été faites ?"></textarea>
      <label>Leçons apprises</label>
      <textarea id="lessons" placeholder="Qu'avez-vous appris ?"></textarea>
      <label>Règle pour demain</label>
      <textarea id="rule_for_tomorrow" placeholder="Quelle règle vous imposez-vous ?"></textarea>
      <button class="btn btn-primary" id="btn-save">Enregistrer</button>
    </div>
  `;
  container.appendChild(page);

  page.querySelector('#btn-back').onclick = () => navigate(`/day/${id}`);
  page.querySelector('#btn-save').onclick = async () => {
    const body = {};
    ['accomplishments','avoidances','failure_reason','lessons','rule_for_tomorrow'].forEach(k => {
      const v = page.querySelector('#' + k).value.trim();
      if (v.length >= 10) body[k] = v;
    });
    try {
      await days.evening(id, body);
      navigate(`/day/${id}`);
    } catch (e) { alert(e.message); }
  };
}
