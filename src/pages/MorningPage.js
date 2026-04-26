import { days } from '../api.js';
import { navigate } from '../router.js';

export default async function MorningPage(container) {
  const id = location.pathname.split('/').pop();
  const page = document.createElement('div');
  page.className = 'page';
  page.innerHTML = `
    <div style="display:flex; align-items:center; gap:12px; margin-bottom:16px;">
      <button class="btn btn-outline" style="width:auto; padding:8px 14px;" id="btn-back">←</button>
      <h1 style="margin:0;">☀️ Matin</h1>
    </div>
    <div class="card">
      <label>Action 1</label>
      <input type="text" id="a1" placeholder="Faire du sport" />
      <label>Action 2</label>
      <input type="text" id="a2" placeholder="Coder API" />
      <label>Action 3 (optionnel)</label>
      <input type="text" id="a3" placeholder="Lire 20 pages" />
      <label>Focus du jour</label>
      <input type="text" id="focus" placeholder="Discipline" />
      <button class="btn btn-primary" id="btn-save">Valider</button>
    </div>
  `;
  container.appendChild(page);

  page.querySelector('#btn-back').onclick = () => navigate(`/day/${id}`);
  page.querySelector('#btn-save').onclick = async () => {
    const actions = [page.querySelector('#a1').value, page.querySelector('#a2').value, page.querySelector('#a3').value]
      .map(s => s.trim()).filter(Boolean);
    const focus = page.querySelector('#focus').value.trim();
    if (actions.length < 1 || actions.length > 3) return alert('1 à 3 actions requises');
    if (!focus) return alert('Focus requis');
    try {
      await days.morning(id, { actions, focus });
      navigate(`/day/${id}`);
    } catch (e) { alert(e.message); }
  };
}
