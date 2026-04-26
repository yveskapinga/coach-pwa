import { days } from '../api.js';
import { navigate } from '../router.js';

export default function GratitudePage(container) {
  const id = location.pathname.split('/').pop();
  const page = document.createElement('div');
  page.className = 'page';
  page.innerHTML = `
    <div style="display:flex; align-items:center; gap:12px; margin-bottom:16px;">
      <button class="btn btn-outline" style="width:auto; padding:8px 14px;" id="btn-back">←</button>
      <h1 style="margin:0;">🙏 Gratitude</h1>
    </div>
    <div class="card">
      <p style="color:var(--text-muted); margin-bottom:16px;">Notez 3 choses pour lesquelles vous êtes reconnaissant aujourd'hui.</p>
      <div class="gratitude-input" contenteditable id="g1">Ma santé</div>
      <div class="gratitude-input" contenteditable id="g2">Ma famille</div>
      <div class="gratitude-input" contenteditable id="g3">Le soleil</div>
      <button class="btn btn-primary" id="btn-save">Enregistrer</button>
    </div>
  `;
  container.appendChild(page);

  page.querySelector('#btn-back').onclick = () => navigate(`/day/${id}`);
  page.querySelector('#btn-save').onclick = async () => {
    const items = [1,2,3].map(i => page.querySelector('#g' + i).innerText.trim()).filter(Boolean);
    if (items.length !== 3) return alert('Exactement 3 items requis');
    try {
      await days.gratitude(id, { items });
      navigate(`/day/${id}`);
    } catch (e) { alert(e.message); }
  };
}
