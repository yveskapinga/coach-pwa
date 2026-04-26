// PatternsPage.js - Statistiques et patterns de l'utilisateur

import { analytics } from '../api.js';
import { navigate } from '../router.js';
import BottomNav from '../components/BottomNav.js';
import { showToast } from '../components/Toast.js';

export default async function PatternsPage(container) {
  const page = document.createElement('div');
  page.className = 'page';
  page.innerHTML = `
    <div style="max-width:560px; margin:0 auto;">
      <div class="skeleton" style="height:40px; width:60%; margin-bottom:20px; border-radius:12px;"></div>
      <div class="skeleton" style="height:120px; margin-bottom:16px; border-radius:20px;"></div>
      <div class="skeleton" style="height:80px; margin-bottom:16px; border-radius:16px;"></div>
      <div class="skeleton" style="height:80px; border-radius:16px;"></div>
    </div>
  `;
  container.appendChild(page);

  let data;
  try {
    data = await analytics.patterns();
  } catch (err) {
    console.error(err);
    showToast('Impossible de charger les statistiques', 'error');
    page.innerHTML = `
      <div class="empty-state" style="text-align:center; padding:2rem;">
        <div style="font-size:56px;">📊</div>
        <p>Impossible de charger les statistiques</p>
        <button class="btn btn-primary" id="btn-retry" style="max-width:200px;">Réessayer</button>
      </div>
    `;
    page.querySelector('#btn-retry')?.addEventListener('click', () => location.reload());
    container.appendChild(BottomNav());
    return;
  }

  const p = data.patterns;

  function render() {
    const avgCompletion = Math.round(p.avg_completion || 0);
    const daysCount = p.days_count || 0;

    let html = `
      <div style="max-width:560px; margin:0 auto;">
        <!-- En-tête avec retour -->
        <div style="display:flex; align-items:center; gap:12px; margin-bottom:24px; animation:slideUp 0.3s ease;">
          <button class="btn btn-outline" id="btn-back" style="width:auto; padding:10px 16px;">← Retour</button>
          <h1 style="margin:0; font-size:1.5rem;">📊 Statistiques</h1>
        </div>

        <!-- Cartes stats -->
        <div class="stats-grid" style="margin-bottom:20px; animation:slideUp 0.4s ease 0.05s backwards;">
          <div class="stat-card">
            <div class="stat-value" style="color:var(--success);">${avgCompletion}%</div>
            <div class="stat-label">Complétion moyenne</div>
            <div class="progress-bar" style="margin-top:8px;">
              <div class="progress-bar-fill" style="width:${avgCompletion}%; background:linear-gradient(90deg, var(--success), #16a34a);"></div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-value" style="color:var(--primary);">${daysCount}</div>
            <div class="stat-label">Journées enregistrées</div>
          </div>
        </div>
    `;

    // Top concepts
    if (p.top_concepts && p.top_concepts.length > 0) {
      const maxCount = Math.max(...p.top_concepts.map(c => c.count));
      html += `<h2 style="margin:24px 0 12px; animation:fadeIn 0.5s ease;">🔥 Concepts populaires</h2>`;
      p.top_concepts.forEach((c, idx) => {
        const pct = maxCount > 0 ? Math.round((c.count / maxCount) * 100) : 0;
        html += `
          <div class="card" style="margin-bottom:12px; animation:slideUp 0.3s ease ${0.1 + idx * 0.04}s backwards; padding:16px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
              <span style="font-weight:600;">${escapeHtml(c.label)}</span>
              <span style="color:var(--text-muted); font-size:0.8rem;">${c.count}x</span>
            </div>
            <div class="progress-bar">
              <div class="progress-bar-fill" style="width:${pct}%; background:linear-gradient(90deg, #a78bfa, #8b5cf6);"></div>
            </div>
          </div>
        `;
      });
    }

    // Freins récurrents
    if (p.common_failure_reasons && p.common_failure_reasons.length > 0) {
      html += `<h2 style="margin:24px 0 12px;">⚠️ Freins récurrents</h2>`;
      p.common_failure_reasons.forEach((f, idx) => {
        html += `
          <div class="card card-danger" style="margin-bottom:12px; animation:slideUp 0.3s ease ${0.1 + idx * 0.04}s backwards; padding:16px;">
            <div style="display:flex; justify-content:space-between; align-items:center; gap:12px;">
              <span style="flex:1; font-size:0.95rem;">${escapeHtml(f.label)}</span>
              <span style="color:var(--danger); font-weight:700;">${f.count}x</span>
            </div>
          </div>
        `;
      });
    }

    if ((!p.top_concepts || p.top_concepts.length === 0) && (!p.common_failure_reasons || p.common_failure_reasons.length === 0)) {
      html += `
        <div class="empty-state" style="margin-top:40px;">
          <div style="font-size:48px;">✨</div>
          <p>Pas encore assez de données<br />Continue à remplir tes journées !</p>
        </div>
      `;
    }

    html += `</div>`;
    page.innerHTML = html;
    page.querySelector('#btn-back')?.addEventListener('click', () => navigate('/dashboard'));
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
      if (m === '&') return '&amp;';
      if (m === '<') return '&lt;';
      if (m === '>') return '&gt;';
      return m;
    });
  }

  render();
  container.appendChild(BottomNav());
}
// import { analytics } from '../api.js';
// import { navigate } from '../router.js';
// import BottomNav from '../components/BottomNav.js';
// import { showToast } from '../components/Toast.js';

// export default async function PatternsPage(container) {
//   const page = document.createElement('div');
//   page.className = 'page';
//   page.innerHTML = `<div id="content" style="display:flex;align-items:center;justify-content:center;min-height:50vh;"><div class="skeleton" style="width:60px;height:60px;border-radius:50%;"></div></div>`;
//   container.appendChild(page);

//   let data;
//   try {
//     data = await analytics.patterns();
//   } catch {
//     showToast('Impossible de charger les statistiques', 'error');
//     page.querySelector('#content').innerHTML = `
//       <div class="empty-state">
//         <p>Impossible de charger les statistiques</p>
//         <button class="btn btn-primary" id="btn-retry" style="margin-top:16px;max-width:200px;margin-left:auto;margin-right:auto;">Réessayer</button>
//       </div>
//     `;
//     page.querySelector('#btn-retry')?.addEventListener('click', () => location.reload());
//     container.appendChild(BottomNav());
//     return;
//   }

//   const p = data.patterns;

//   let html = `
//     <div style="display:flex;align-items:center;gap:14px;margin-bottom:20px;animation:slideUp 0.3s ease;">
//       <button class="btn btn-outline" id="btn-back" style="width:auto;padding:10px 14px;font-size:13px;flex-shrink:0;">
//         <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
//       </button>
//       <h1 style="margin:0;font-size:22px;">Statistiques 📊</h1>
//     </div>

//     <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px;animation:slideUp 0.4s ease 0.05s backwards;">
//       <div class="card" style="margin-bottom:0;background:linear-gradient(145deg,#1a2e1f,#152618);border-left:3px solid var(--success);">
//         <div style="font-size:13px;color:var(--text-muted);margin-bottom:6px;">Complétion moyenne</div>
//         <div style="font-size:32px;font-weight:800;color:var(--success);">${Math.round(p.avg_completion || 0)}%</div>
//         <div class="progress-bar" style="margin-top:10px;">
//           <div class="progress-bar-fill" style="width:${Math.round(p.avg_completion || 0)}%;background:linear-gradient(90deg,var(--success),#16a34a);"></div>
//         </div>
//       </div>
//       <div class="card" style="margin-bottom:0;border-left:3px solid var(--primary);">
//         <div style="font-size:13px;color:var(--text-muted);margin-bottom:6px;">Journées</div>
//         <div style="font-size:32px;font-weight:800;color:var(--primary);">${p.days_count || 0}</div>
//         <div style="font-size:13px;color:var(--text-muted);margin-top:8px;">enregistrées</div>
//       </div>
//     </div>
//   `;

//   if (p.top_concepts && p.top_concepts.length > 0) {
//     html += `<h2 style="animation:fadeIn 0.5s ease;margin-top:24px;margin-bottom:12px;">Concepts populaires</h2>`;
//     const maxCount = Math.max(...p.top_concepts.map(c => c.count));
//     p.top_concepts.forEach((c, i) => {
//       const pct = maxCount > 0 ? Math.round((c.count / maxCount) * 100) : 0;
//       html += `
//         <div class="card" style="animation:slideUp 0.3s ease ${0.1 + i * 0.04}s backwards;padding:16px 20px;">
//           <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
//             <span style="font-weight:600;font-size:15px;word-break:break-word;flex:1;padding-right:12px;">${c.label}</span>
//             <span style="font-size:13px;color:var(--text-muted);flex-shrink:0;">${c.count}x</span>
//           </div>
//           <div class="progress-bar">
//             <div class="progress-bar-fill" style="width:${pct}%;background:linear-gradient(90deg,#a78bfa,#8b5cf6);"></div>
//           </div>
//         </div>
//       `;
//     });
//   }

//   if (p.common_failure_reasons && p.common_failure_reasons.length > 0) {
//     html += `<h2 style="animation:fadeIn 0.5s ease;margin-top:24px;margin-bottom:12px;">Freins récurrents</h2>`;
//     p.common_failure_reasons.forEach((f, i) => {
//       html += `
//         <div class="card card-danger" style="animation:slideUp 0.3s ease ${0.1 + i * 0.04}s backwards;padding:16px 20px;">
//           <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;">
//             <span style="font-weight:600;font-size:15px;word-break:break-word;flex:1;">${f.reason}</span>
//             <span style="font-size:13px;color:var(--danger);font-weight:700;flex-shrink:0;">${f.count}x</span>
//           </div>
//         </div>
//       `;
//     });
//   }

//   page.querySelector('#content').innerHTML = html;
//   page.querySelector('#btn-back').onclick = () => navigate('/dashboard');
//   container.appendChild(BottomNav());
// }
