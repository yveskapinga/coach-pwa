import { days, auth } from '../api.js';
import { navigate } from '../router.js';
import BottomNav from '../components/BottomNav.js';

export default async function DashboardPage(container) {
  const page = document.createElement('div');
  page.className = 'page';
  page.innerHTML = `<h1>Dashboard</h1><div id="content">Chargement...</div>`;
  container.appendChild(page);

  let user;
  try { user = await auth.me(); } catch { return navigate('/', true); }

  const today = new Date().toISOString().split('T')[0];
  let dayList = [];
  try { const d = await days.list(); dayList = d.days || []; } catch {}

  const todayDay = dayList.find(d => d.date === today);

  let html = `
    <div class="card" style="text-align:center;">
      <div style="font-size:48px;">👋</div>
      <h2>Bonjour ${user.user.first_name}</h2>
      <p style="color:var(--text-muted);">${new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
    </div>
  `;

  if (!todayDay) {
    html += `
      <div class="card empty-state">
        <p>Aucune journée pour aujourd'hui</p>
        <button class="btn btn-primary" id="btn-create" style="margin-top:12px;">Créer ma journée</button>
      </div>
    `;
  } else {
    const statusClass = `status-${todayDay.status.toLowerCase()}`;
    html += `
      <div class="card">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div>
            <h2>Aujourd'hui</h2>
            <span class="status-badge ${statusClass}">${todayDay.status}</span>
          </div>
          <div style="font-size:32px;">${todayDay.completion_rate || 0}%</div>
        </div>
        <button class="btn btn-primary" style="margin-top:16px;" id="btn-continue">Continuer</button>
      </div>
    `;
  }

  if (dayList.length > 1) {
    html += `<h2 style="margin-top:24px;">Historique</h2>`;
    dayList.slice(1, 6).forEach(d => {
      html += `
        <div class="card" style="display:flex; justify-content:space-between; align-items:center; cursor:pointer;" data-id="${d.id}">
          <div>
            <div style="font-weight:600;">${new Date(d.date).toLocaleDateString('fr-FR')}</div>
            <span class="status-badge status-${d.status.toLowerCase()}">${d.status}</span>
          </div>
          <div style="font-size:20px; font-weight:700; color:var(--primary);">${d.completion_rate || 0}%</div>
        </div>
      `;
    });
  }

  page.querySelector('#content').innerHTML = html;

  page.querySelector('#btn-create')?.addEventListener('click', async () => {
    try {
      const d = await days.create({ date: today });
      navigate(`/day/${d.day.id}`);
    } catch (e) { alert(e.message); }
  });

  page.querySelector('#btn-continue')?.addEventListener('click', () => {
    navigate(`/day/${todayDay.id}`);
  });

  page.querySelectorAll('[data-id]').forEach(el => {
    el.onclick = () => navigate(`/day/${el.dataset.id}`);
  });

  container.appendChild(BottomNav());
}
