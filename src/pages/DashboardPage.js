import { days, auth, analytics } from '../api.js';
import { navigate } from '../router.js';
import BottomNav from '../components/BottomNav.js';
import { showToast } from '../components/Toast.js';

function getLocalDateString() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default async function DashboardPage(container) {
  const page = document.createElement('div');
  page.className = 'page';
  page.innerHTML = `
    <div id="content">
      <div class="skeleton" style="height:120px;margin-bottom:16px;"></div>
      <div class="skeleton" style="height:180px;margin-bottom:16px;"></div>
    </div>
  `;
  container.appendChild(page);

  let user;
  try { user = await auth.me(); } catch { return navigate('/', true); }

  const today = getLocalDateString();
  let todayDay = null;
  let patterns = null;

  async function loadData() {
    try {
      const [todayRes, patternsRes] = await Promise.all([
        days.today(today).catch(() => ({ day: null })),
        analytics.patterns().catch(() => null),
      ]);
      todayDay = todayRes.day || null;
      patterns = patternsRes?.patterns || null;
      render();
    } catch {
      page.querySelector('#content').innerHTML = `
        <div class="empty-state">
          <p>Impossible de charger vos données</p>
          <button class="btn btn-primary" id="btn-retry" style="margin-top:16px;">Réessayer</button>
        </div>
      `;
      page.querySelector('#btn-retry')?.addEventListener('click', () => loadData());
    }
  }

  function render() {
    let html = `
      <div class="card" style="text-align:center;animation:slideUp 0.4s ease;">
        <h2 style="margin-bottom:4px;">Bonjour ${user.user.first_name} 👋</h2>
        <p style="color:var(--text-muted);font-size:14px;margin:0;">${new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
      </div>
    `;

    // Stats summary
    if (patterns) {
      const avg = Math.round(patterns.avg_completion || 0);
      const count = patterns.days_count || 0;
      html += `
        <div class="stats-grid" style="animation:slideUp 0.4s ease 0.05s backwards;">
          <div class="stat-card">
            <div class="stat-value" style="color:var(--primary);">${avg}%</div>
            <div class="stat-label">Complétion</div>
          </div>
          <div class="stat-card">
            <div class="stat-value" style="color:var(--success);">${count}</div>
            <div class="stat-label">Journées</div>
          </div>
          <div class="stat-card">
            <div class="stat-value" style="color:var(--warning);">${todayDay ? (todayDay.completion_rate || 0) : 0}%</div>
            <div class="stat-label">Aujourd'hui</div>
          </div>
        </div>
      `;
    }

    if (!todayDay) {
      html += `
        <div class="card empty-state" style="animation:slideUp 0.4s ease 0.1s backwards;">
          <div style="font-size:48px;margin-bottom:12px;opacity:0.6;">🌅</div>
          <p style="font-size:17px;margin-bottom:4px;font-weight:600;">Nouvelle journée</p>
          <p style="color:var(--text-muted);font-size:14px;margin-bottom:20px;">Créez votre journée pour commencer</p>
          <button class="btn btn-primary" id="btn-create" style="max-width:260px;margin:0 auto;">Créer ma journée</button>
        </div>
      `;
    } else {
      const statusClass = `status-${todayDay.status.toLowerCase()}`;
      const statusLabels = { CREATED: 'Créée', STARTED: 'En cours', COMPLETED: 'Terminée' };
      html += `
        <div class="card card-accent" style="animation:slideUp 0.4s ease 0.1s backwards;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; flex-wrap:wrap; gap:10px;">
            <div>
              <h3 style="margin:0 0 6px;">Ma journée</h3>
              <span class="status-badge ${statusClass}">${statusLabels[todayDay.status] || todayDay.status}</span>
            </div>
            <div style="text-align:center;">
              <div style="font-size:28px;font-weight:800;color:var(--primary);">${todayDay.completion_rate || 0}%</div>
            </div>
          </div>
          <div class="progress-bar">
            <div class="progress-bar-fill" style="width:${todayDay.completion_rate || 0}%"></div>
          </div>
          <button class="btn btn-primary" style="margin-top:16px;" id="btn-continue">
            ${todayDay.status === 'COMPLETED' ? 'Voir ma journée' : 'Continuer'}
          </button>
        </div>
      `;
    }

    page.querySelector('#content').innerHTML = html;

    page.querySelector('#btn-create')?.addEventListener('click', async () => {
      const btn = page.querySelector('#btn-create');
      btn.disabled = true;
      btn.textContent = 'Création...';
      try {
        const d = await days.create({ date: today });
        showToast('Journée créée !', 'success');
        navigate(`/day/${d.day.id}`);
      } catch {
        showToast('Impossible de créer la journée', 'error');
        btn.disabled = false;
        btn.textContent = 'Créer ma journée';
      }
    });

    page.querySelector('#btn-continue')?.addEventListener('click', () => {
      navigate(`/day/${todayDay.id}`);
    });
  }

  await loadData();
  container.appendChild(BottomNav());
}
