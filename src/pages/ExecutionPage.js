import { days } from '../api.js';
import { navigate } from '../router.js';

export default async function ExecutionPage(container) {
  const id = location.pathname.split('/').pop();
  const page = document.createElement('div');
  page.className = 'page';
  page.innerHTML = `<div id="content">Chargement...</div>`;
  container.appendChild(page);

  let data;
  try { data = await days.get(id); } catch { return navigate('/dashboard'); }
  const actions = data.entries.filter(e => e.type === 'ACTION');

  let html = `
    <div style="display:flex; align-items:center; gap:12px; margin-bottom:16px;">
      <button class="btn btn-outline" style="width:auto; padding:8px 14px;" id="btn-back">←</button>
      <h1 style="margin:0;">⚡ Exécution</h1>
    </div>
    <div class="card">
  `;

  actions.forEach(a => {
    html += `
      <div class="action-item" data-id="${a.id}">
        <span>${a.raw_text}</span>
        <div style="display:flex; gap:8px;">
          <button class="btn btn-outline" style="width:auto; padding:6px 12px; font-size:13px;" data-status="DONE" data-id="${a.id}">✓ Fait</button>
          <button class="btn btn-outline" style="width:auto; padding:6px 12px; font-size:13px;" data-status="NOT_DONE" data-id="${a.id}">✕ Non</button>
        </div>
      </div>
    `;
  });

  html += `<button class="btn btn-primary" style="margin-top:16px;" id="btn-save">Enregistrer</button></div>`;
  page.querySelector('#content').innerHTML = html;

  const statusMap = {};
  page.querySelectorAll('[data-status]').forEach(btn => {
    btn.onclick = () => {
      statusMap[btn.dataset.id] = btn.dataset.status;
      btn.parentElement.parentElement.querySelectorAll('button').forEach(b => b.style.borderColor = 'var(--surface-light)');
      btn.style.borderColor = btn.dataset.status === 'DONE' ? 'var(--success)' : 'var(--danger)';
    };
  });

  page.querySelector('#btn-back').onclick = () => navigate(`/day/${id}`);
  page.querySelector('#btn-save').onclick = async () => {
    const updates = actions.map(a => ({ id: a.id, status: statusMap[a.id] || a.status }));
    try {
      await days.execution(id, { actions: updates });
      navigate(`/day/${id}`);
    } catch (e) { alert(e.message); }
  };
}
